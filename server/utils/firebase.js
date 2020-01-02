const admin = require('firebase-admin');
const log = require('./log');

const logger = log.child({ name: 'server' });


try {
  if (process.env.GCLOUD_PROJECT) {
    admin.initializeApp();
  } else {
    const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  logger.fatal(error, 'could not initialize firebase-admin');
}

module.exports = admin;
