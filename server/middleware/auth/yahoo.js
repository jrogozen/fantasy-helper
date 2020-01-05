const yahooUtils = require('../../utils/apis/yahoo');

const {
  YahooMissingTokenError,
} = require('../../utils/errors');

function yahooAuthMiddleware(req, res, next) {
  const accessToken = yahooUtils.getAccessTokenFromReq(req);

  if (!accessToken) {
    next(new YahooMissingTokenError('missing yahoo_access_token'));
  }

  res.locals.hasYahooToken = true;

  next();
}

module.exports = yahooAuthMiddleware;
