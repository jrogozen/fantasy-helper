const express = require('express');

const Database = require('../../database');
const yahooUtils = require('../../utils/apis/yahoo');

const {
  httpResourceNotFound,
  ServerError,
} = require('../../utils/errors');

const router = express.Router();

router.get('/info', (req, res, next) => {
  const requestedUser = req.query.yahooGuid;
  const yahooRefreshToken = yahooUtils.getRefreshTokenFromReq(req);

  if (requestedUser) {
    return Database.users.findOrCreate({ yahooGuid: requestedUser }, true)
      .then((user) => {
        if (!user) {
          return res.status(200).send(httpResourceNotFound('matching user not found', false, {
            yahooGuid: req.query.yahooGuid,
          }));
        }

        return res.status(200).send({
          success: true,
          data: {
            user: user.getPublicDetails(),
          },
        });
      })
      .catch((error) => next(error));
  }

  if (yahooRefreshToken) {
    return Database.users.getCurrentUser({ yahooRefreshToken })
      .then((user) => {
        if (!user) {
          return res.status(200).send(httpResourceNotFound('matching user not found', false, {
            yahooRefreshToken,
          }));
        }

        return user.getYahooAccessToken().then((creds) => {
          yahooUtils.setResponseCookies({ user, accessToken: creds.accessToken, res });

          return res.status(200).send({
            success: true,
            data: {
              user,
              ...creds,
            },
          });
        });
      })
      .catch((error) => next(error));
  }

  throw new ServerError('currently only support yahoo users', req, res);
});

module.exports = router;
