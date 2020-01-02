const express = require('express');
// const log = require('../../utils/log');
// const Database = require('../../database');
const { ServerError } = require('../../utils/errors');

const router = express.Router();
// const logger = log.child({ name: 'users' });

// gets user
router.get('/info', (req, res) => {
  // get user based on yahooGuid
  if (req.query.guid) {
    res.send('ok');
  } else {
    throw new ServerError('only supports getting yahoo users', req, res);
  }
});

module.exports = router;
