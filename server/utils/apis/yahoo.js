const log = require('../log');

const logger = log.child({ name: 'api' });

const urls = {
  authorization: 'https://api.login.yahoo.com/oauth2/request_auth',
  getToken: 'https://api.login.yahoo.com/oauth2/get_token',
  userInfo(guid) {
    return `https://social.yahooapis.com/v1/user/${guid}/profile?format=json`;
  },
  fantasy: 'https://fantasysports.yahooapis.com/fantasy/v2',
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
  res.cookie('yahoo_access_token', accessToken, { httpOnly: true });
  res.cookie('yahoo_refresh_token', user.yahooRefreshToken, { httpOnly: true });
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

function createGamesFilter(req) {
  let gamesFilter = '';

  if (req.query.is_available) {
    gamesFilter += `is_available=${req.query.is_available};`;
  }

  if (req.query.game_types) {
    gamesFilter += `game_types=${req.query.game_types};`;
  }

  if (req.query.game_keys) {
    gamesFilter += `game_keys=${req.query.game_keys};`;
  }

  if (req.query.seasons) {
    gamesFilter += `seasons=${req.query.seasons};`;
  }

  return gamesFilter;
}

module.exports = {
  createGamesFilter,
  createBasicAuthorizationHeader,
  createBearerAuthorizationHeader,
  getRefreshTokenFromReq,
  setResponseCookies,
  urls,
};
