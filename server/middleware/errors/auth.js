const { ERROR_CODES } = require('../../../shared/utils/errors');
const log = require('../../utils/log');

const logger = log.child({ name: 'error' });

function handleAuthError(error, req, res, next) {
  if (error.code === ERROR_CODES.yahooMissingTokenError) {
    logger.warn('redirect request to yahoo signin');

    if (process.env.GCLOUD_PROJECT) {
      return res.redirect(301, '/widgets/api/v1/auth/yahoo/signin');
    }

    return res.redirect(301, '/api/v1/auth/yahoo/signin');
  }

  if (error.code === ERROR_CODES.yahooInvalidTokenError) {
    logger.warn('redirect request to yahoo refresh');

    if (process.env.GCLOUD_PROJECT) {
      return res.redirect(301, `/widgets/api/v1/auth/yahoo/refresh?redirect=/widgets/${req.originalUrl}`);
    }

    return res.redirect(301, `/api/v1/auth/yahoo/refresh?redirect=${req.originalUrl}`);
  }

  return next();
}

module.exports = handleAuthError;
