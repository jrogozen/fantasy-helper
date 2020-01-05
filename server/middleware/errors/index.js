const handleGenericError = require('./generic');
const handleAuthError = require('./auth');

function setErrorMiddleware(app) {
  app.use('*',
    handleAuthError,
    handleGenericError);
}

module.exports = setErrorMiddleware;
