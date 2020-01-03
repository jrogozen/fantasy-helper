const log = require('../log');

const logger = log.child({ name: 'api' });

const urls = {
  authorization: 'https://api.login.yahoo.com/oauth2/request_auth',
  getToken: 'https://api.login.yahoo.com/oauth2/get_token',
  userInfo(guid) {
    return `https://social.yahooapis.com/v1/user/${guid}/profile?format=json`;
  },
};

function createBasicAuthorizationHeader() {
  const auth = Buffer.from(`${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SECRET}`).toString('base64');
  logger.debug({
    YAHOO_CLIENT_ID: process.env.YAHOO_CLIENT_ID,
    YAHOO_CLIENT_SECRET: process.env.YAHOO_CLIENT_SECRET,
  }, 'creating authorization header using');

  return `Basic ${auth}`;
}

function createBearerAuthorizationHeader(token) {
  return `Bearer ${token}`;
}

function setResponseCookies({ user, accessToken, res }) {
  res.cookie('yahoo_access_token', accessToken, { secure: true });
  res.cookie('yahoo_refresh_token', user.yahooRefreshToken, { secure: true });
}

function getRefreshTokenFromReq(req) {
  logger.debug({
    headerToken: req.headers.yahoo_refresh_token,
    cookieToken: req.cookies.yahoo_refresh_token,
    body: req.body,
    queryToken: req.query.yahooRefreshToken,
  }, 'getting refresh token from request');

  if (req.headers.yahoo_refresh_token) {
    return req.headers.yahoo_refresh_token;
  }

  if (req.cookies.yahoo_refresh_token) {
    return req.cookies.yahoo_refresh_token;
  }

  if (req.body.creds && req.body.creds.yahooRefreshToken) {
    return req.body.creds.yahooRefreshToken;
  }

  if (req.query.yahooRefreshToken) {
    return req.query.yahooRefreshToken;
  }

  return null;
}

module.exports = {
  createBasicAuthorizationHeader,
  createBearerAuthorizationHeader,
  getRefreshTokenFromReq,
  setResponseCookies,
  urls,
};
