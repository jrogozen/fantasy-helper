const axios = require('axios');
const express = require('express');
const querystring = require('querystring');

const Database = require('../database');
const yahooUtils = require('../utils/apis/yahoo');
const log = require('../utils/log');
const { ServerError } = require('../utils/errors');
const YahooAuthApi = require('../resources/yahoo/auth');
const YahooSocialApi = require('../resources/yahoo/social');

const logger = log.child({ name: 'auth' });
const router = express.Router();

// ask user to sign in with yahoo
router.get('/signin', (req, res) => {
  const queryParams = querystring.stringify({
    client_id: process.env.YAHOO_CLIENT_ID,
    redirect_uri: process.env.YAHOO_REDIRECT_URI,
    response_type: 'code',
  });

  res.redirect(`${yahooUtils.urls.auth}/request_auth?${queryParams}`);
});

router.get('/handler', (req, res, next) => {
  logger.debug('requesting tokens from yahoo with code=%s', req.query.code);

  YahooAuthApi.getToken(req, res)
    .then(function getProfileInformation(creds) {
      const yahooSocialApi = new YahooSocialApi({
        accessToken: creds.accessToken,
        guid: creds.guid,
      });

      return yahooSocialApi.profile()
        .then((response) => ({ ...response, ...creds }));
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
      }).then((user) => ({ user, creds: { accessToken, refreshToken } }));
    })
    .then(function returnAuthResponse({ user, creds }) {
      if (user) {
        yahooUtils.setResponseCookies({
          refreshToken: creds.refreshToken,
          accessToken: creds.accessToken,
          res,
        });

        res.send({
          sucess: true,
          data: {
            user,
            creds,
          },
        });
      } else {
        throw new ServerError('could not find or create a yahoo user', req, res);
      }
    })
    .catch((error) => next(error));
});

router.get('/refresh', (req, res, next) => {
  const refreshToken = yahooUtils.getRefreshTokenFromReq(req);
  const { redirect } = req.query;

  if (!refreshToken) {
    throw new ServerError('missing refresh token', req, res);
  }

  YahooAuthApi.getToken(req, res, refreshToken)
    .then((creds) => {
      yahooUtils.setResponseCookies({
        refreshToken: creds.refreshToken,
        accessToken: creds.accessToken,
        res,
      });

      if (!redirect) {
        return res.status(200).send({
          success: true,
          data: {
            ...creds,
          },
        });
      }

      return res.redirect(301, redirect);
    })
    .catch((error) => next(error));
});

module.exports = router;
