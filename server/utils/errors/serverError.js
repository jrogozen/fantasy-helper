const { ERROR_CODES } = require('../../../shared/utils/errors');

class ServerError extends Error {
  constructor(message, req, res) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
    }

    this.name = 'ServerError';
    this.code = ERROR_CODES.serverError;
    this.data = {
      req: {
        originalUrl: req.originalUrl,
        headers: req.headers,
        id: req.id,
      },
      res: {
        preErrorStatusCode: res.statusCode,
        headers: res.headers,
      },
    };
  }
}

module.exports = ServerError;
