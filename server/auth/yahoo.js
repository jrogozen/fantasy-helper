const axios = require('axios');
const express = require('express');
const querystring = require('querystring');

const Database = require('../database');
const yahooUtils = require('../utils/apis/yahoo');
const log = require('../utils/log');
const { ServerError } = require('../utils/errors');

const logger = log.child({ name: 'auth' });
const router = express.Router();

// ask user to sign in with yahoo
router.get('/signin', (req, res) => {
  const queryParams = querystring.stringify({
    client_id: process.env.YAHOO_CLIENT_ID,
    redirect_uri: process.env.YAHOO_REDIRECT_URI,
    response_type: 'code',
  });

  res.redirect(`${yahooUtils.urls.authorization}?${queryParams}`);
});

router.get('/auth/handler', (req, res, next) => {
  logger.debug('requesting tokens from yahoo with code=%s', req.query.code);

  axios({
    method: 'post',
    url: yahooUtils.urls.getToken,
    headers: {
      Authorization: yahooUtils.createBasicAuthorizationHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      grant_type: 'authorization_code',
      redirect_uri: process.env.YAHOO_REDIRECT_URI,
      code: req.query.code,
    }),
  })
    .then(function parseGetToken(response) {
      const { data } = response;
      const {
        access_token,
        guid,
        refresh_token,
      } = data;

      log.debug({ guid, access_token, refresh_token }, 'cred response from yahoo');

      if (!access_token || !guid || !refresh_token) {
        throw new ServerError('failed to get token from yahoo', req, res);
      }

      return {
        accessToken: access_token,
        guid,
        refreshToken: refresh_token,
      };
    })
    .then(function getProfileInformation(creds) {
      return axios({
        method: 'get',
        url: yahooUtils.urls.userInfo(creds.guid),
        headers: {
          Authorization: yahooUtils.createBearerAuthorizationHeader(creds.accessToken),
        },
      }).then((socialResponse) => ({ ...socialResponse, ...creds }));
    })
    .then(function parseProfileInfo(response) {
      const {
        accessToken,
        refreshToken,
        guid,
        data,
      } = response;

      if (!data.profile) {
        throw new ServerError('no associated yahoo user info returned', req, res);
      }

      const {
        email,
        firstName,
        lastName,
        nickname,
      } = data.profile;

      return Database.users.findOrCreate({
        email,
        firstName,
        lastName,
        nickname,
        yahooGuid: guid,
        yahooRefreshToken: refreshToken,
      }).then((user) => ({ ...user, accessToken }));
    })
    .then(function returnAuthResponse(user) {
      if (user) {
        res.send({
          sucess: true,
          data: user,
        });
      } else {
        throw new ServerError('could not find or create a yahoo user', req, res);
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
