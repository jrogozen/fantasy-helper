const PrettyError = require('pretty-error');

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

const isDev = process.env.NODE_ENV !== 'production';

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

module.exports = LogError;
