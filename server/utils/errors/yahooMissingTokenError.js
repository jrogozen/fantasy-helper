const { ERROR_CODES } = require('../../../shared/utils/errors');

class YahooMissingTokenError extends Error {
  constructor(message, args) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YahooMissingTokenError);
    }

    this.name = 'YahooMissingTokenError';
    this.code = ERROR_CODES.yahooMissingTokenError;
    this.data = {
      ...args,
    };
  }
}

module.exports = YahooMissingTokenError;
