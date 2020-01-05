const express = require('express');

const Database = require('../../database');
const YahooApi = require('../../resources/yahoo');
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

// todo: add auth middleware!
router.get('/leagues', yahooAuthMiddleware, (req, res, next) => {
  const yahooApi = new YahooApi({
    accessToken: req.cookies.yahoo_access_token,
  });

  const gamesFilter = yahooUtils.createGamesFilter(req);

  yahooApi.user.leagues({ gamesFilter })
    .then((data) => res.json({
      success: true,
      data: {
        // only return yahoo data for now, but could change
        yahoo: data,
      },
    }))
    .catch((error) => next(error));
});

// todo: add auth middleware!
router.get('/teams', yahooAuthMiddleware, (req, res, next) => {
  const yahooApi = new YahooApi({
    accessToken: req.cookies.yahoo_access_token,
  });

  const gamesFilter = yahooUtils.createGamesFilter(req);

  yahooApi.user.teams({
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
