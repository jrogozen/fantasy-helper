const handleGenericError = require('./generic');

function setErrorMiddleware(app) {
  app.use('*', handleGenericError);
}

module.exports = setErrorMiddleware;
