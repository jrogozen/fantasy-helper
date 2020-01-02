const axios = require('axios');
const express = require('express');
// const passport = require('passport');
const querystring = require('querystring');
const log = require('../../utils/log');
const Database = require('../../database');

const router = express.Router();
const logger = log.child({ name: 'users' });

// router.get('/signup',
//   passport.authenticate('yahoo', { session: false }),
//   (req, res) => {
//     res.send({
//       success: true,
//       message: 'signup successful',
//       user: req.user,
//     });
//   });

// router.get('/auth/yahoo/callback',
//   (req, res, next) => {
//     logger.info({ body: req.body, query: req.query }, 'hit the yahoo callback url');
//     next();
//   },
//   passport.authenticate('yahoo', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/');
//   });

router.get('/signup', (req, res) => {
  const authorizationUrl = 'https://api.login.yahoo.com/oauth2/request_auth';

  const queryParams = querystring.stringify({
    client_id: process.env.YAHOO_CLIENT_ID,
    redirect_uri: 'https://82f5ac98.ngrok.io/api/v1/users/auth/yahoo/callback',
    response_type: 'code',
  });

  res.redirect(`${authorizationUrl}?${queryParams}`);
});

router.get('/auth/yahoo/callback', (req, res, next) => {
  const accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  logger.info(process.env.YAHOO_CLIENT_SECRET);

  const authorizationHeader = Buffer.from(
    `${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SECRET}`,
  ).toString('base64');

  axios({
    method: 'post',
    url: accessTokenUrl,
    headers: {
      Authorization: `Basic ${authorizationHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      grant_type: 'authorization_code',
      redirect_uri: 'https://82f5ac98.ngrok.io/api/v1/users/auth/yahoo/callback',
      code: req.query.code,
    }),
  })
    .then((response) => {
      const { data } = response;
      const guid = data.xoauth_yahoo_guid;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      logger.info({ guid, accessToken }, 'response from yahoo token request');

      if (!accessToken) {
        throw new Error('did not receive access token');
      }

      const socialApiUrl = `https://social.yahooapis.com/v1/user/${guid}/profile?format=json`;

      return axios({
        method: 'get',
        url: socialApiUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((socialResponse) => ({ ...socialResponse, refreshToken, guid }));
    })
    .then((response) => {
      const {
        refreshToken,
        data,
        guid,
      } = response;
      const {
        email,
        profileImage,
        firstName,
        lastName,
        nickname,
      } = data.profile;

      Database.users.findOrCreate({
        email,
        profileImage,
        firstName,
        lastName,
        nickname,
        guid,
        refreshToken,
      });

      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
