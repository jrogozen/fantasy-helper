const PrettyError = require('pretty-error');

const { ERROR_CODES } = require('../../shared/utils/errors');

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

const isDev = process.env.NODE_ENV !== 'production';

function httpErrorResponse(error) {
  const base = {
    success: false,
    error: error.message,
  };
  const errorProperties = {};

  Object.getOwnPropertyNames(error).forEach((name) => {
    errorProperties[name] = error[name];
  });

  const extended = {
    ...base,
    error: errorProperties,
  };

  if (process.env !== 'production') {
    return extended;
  }

  return base;
}

function LogError({
  error,
  logger,
  message,
  additional = {},
}) {
  if (isDev) {
    console.log(`\n${pe.render(error)}`);
  }

  logger.error({
    error: {
      name: error.name,
      stack: error.stack,
      message: error.message,
      code: error.code,
      data: error.data,
    },
    ...additional,
  }, message);
}

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

module.exports = {
  LogError,
  httpErrorResponse,
  ServerError,
};
