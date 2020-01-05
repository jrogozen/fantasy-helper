const { ERROR_CODES } = require('../../../shared/utils/errors');

class YahooInvalidTokenError extends Error {
  constructor(message, args) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YahooInvalidTokenError);
    }

    this.name = 'YahooInvalidTokenError';
    this.code = ERROR_CODES.yahooInvalidTokenError;
    this.data = {
      ...args,
    };
  }
}

module.exports = YahooInvalidTokenError;
