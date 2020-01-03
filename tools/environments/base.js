const path = require('path');

const logPath = path.resolve(__dirname, '..', '..', 'logs');
const serviceAccountPath = path.resolve(__dirname, '..', 'accounts', 'firebase.json');
const stackDriverAccountPath = path.resolve(__dirname, '..', 'accounts', 'stackdriver.json');

module.exports = {
  build: {

  },
  run: {
    LOG_LEVEL: 'debug',
    LOG_PATH: logPath,
    LOG_PRETTY: true,
    PORT: 3000,
    SERVICE_ACCOUNT_PATH: serviceAccountPath,
    STACKDRIVER_ACCOUNT_PATH: stackDriverAccountPath,
    YAHOO_CLIENT_ID: 'changeme',
    YAHOO_CLIENT_SECRET: 'changeme',
    YAHOO_REDIRECT_URI: 'changeme',
  },
};
