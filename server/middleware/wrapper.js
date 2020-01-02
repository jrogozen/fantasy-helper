function wrapAsync(fn) {
  return function wrappedMiddleware(req, res, next) {
    if (res.headersSent) {
      next(new Error('response headers already sent'));
    }
    fn(req, res, next).catch(next);
  };
}

module.exports = wrapAsync;
