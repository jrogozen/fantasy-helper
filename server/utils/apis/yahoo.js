const urls = {
  authorization: 'https://api.login.yahoo.com/oauth2/request_auth',
  getToken: 'https://api.login.yahoo.com/oauth2/get_token',
  userInfo(guid) {
    return `https://social.yahooapis.com/v1/user/${guid}/profile?format=json`;
  },
};

function createBasicAuthorizationHeader() {
  const auth = Buffer.from(`${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SERVER}`).toString('base64');

  return `Basic ${auth}`;
}

function createBearerAuthorizationHeader(token) {
  return `Bearer ${token}`;
}

module.exports = {
  createBasicAuthorizationHeader,
  createBearerAuthorizationHeader,
  urls,
};
