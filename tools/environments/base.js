const path = require('path');

const logPath = path.resolve(__dirname, '..', '..', 'logs');
const serviceAccountPath = path.resolve(__dirname, '..', 'accounts', 'firebase.json');

module.exports = {
  build: {

  },
  run: {
    LOG_LEVEL: 'debug',
    LOG_PATH: logPath,
    LOG_PRETTY: true,
    PORT: 3000,
    SERVICE_ACCOUNT_PATH: serviceAccountPath,
    YAHOO_CLIENT_ID: 'changeme',
    YAHOO_CLIENT_SECRET: 'changeme',
    SESSION_SECRET: 'changeme',
  },
};
