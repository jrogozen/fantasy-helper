const express = require('express');

const Database = require('../../database');
const {
  httpResourceNotFound,
  ServerError,
} = require('../../utils/errors');

const router = express.Router();

router.get('/info', (req, res, next) => {
  if (!req.query.yahooGuid) {
    throw new ServerError('currently only support yahoo users', req, res);
  }

  Database.users.findOrCreate({ yahooGuid: req.query.yahooGuid })
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
});

module.exports = router;
