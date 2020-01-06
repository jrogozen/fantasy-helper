const express = require('express');

const Database = require('../../database');
const YahooAuthApi = require('../../resources/yahoo/auth');
const YahooFantasyApi = require('../../resources/yahoo/fantasy');
const yahooUtils = require('../../utils/apis/yahoo');
const { yahooAuthMiddleware } = require('../../middleware/auth');

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

        return YahooAuthApi.getToken(req, res, yahooRefreshToken)
          .then((creds) => {
            yahooUtils.setResponseCookies({
              refreshToken: creds.refreshToken,
              accessToken: creds.accessToken,
              res,
            });

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

router.get('/leagues', yahooAuthMiddleware, (req, res, next) => {
  const yahooFantasyApi = new YahooFantasyApi({
    accessToken: req.cookies.yahoo_access_token,
  });

  const gamesFilter = yahooUtils.createGamesFilter(req);

  yahooFantasyApi.user.leagues({ gamesFilter })
    .then((data) => res.json({
      success: true,
      data: {
        // only return yahoo data for now, but could change
        yahoo: data,
      },
    }))
    .catch((error) => next(error));
});

router.get('/teams', yahooAuthMiddleware, (req, res, next) => {
  const yahooFantasyApi = new YahooFantasyApi({
    accessToken: req.cookies.yahoo_access_token,
  });

  const gamesFilter = yahooUtils.createGamesFilter(req);

  yahooFantasyApi.user.teams({
    gamesFilter,
    noLeagues: req.query.no_leagues,
  })
    .then((data) => res.json({
      success: true,
      data: {
        // only return yahoo data for now, but could change
        yahoo: data,
      },
    }))
    .catch((error) => next(error));
});

module.exports = router;
