const merge = require('lodash/merge');
const base = require('./base');

const production = merge(base, {
  build: {

  },
  run: {
    LOG_LEVEL: 'debug',
    LOG_PRETTY: false,
    YAHOO_REDIRECT_URI: 'https://us-central1-fantasyhelper-1b460.cloudfunctions.net/widgets/api/v1/auth/yahoo/handler',
  },
});

module.exports = production;
