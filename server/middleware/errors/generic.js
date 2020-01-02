const log = require('../../utils/log');
const { LogError, httpErrorResponse } = require('../../utils/errors');

const logger = log.child({ name: 'errors' });

function handleGenericError(error, req, res, _) {
  LogError({
    error,
    logger,
    message: 'handling generic error in express middleware',
  });

  const toSend = httpErrorResponse(error);

  res.status(500).send(toSend);
}

module.exports = handleGenericError;
