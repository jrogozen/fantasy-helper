const axios = require('axios');
const querystring = require('querystring');

const log = require('../../../utils/log');
const yahooUtils = require('../../../utils/apis/yahoo');
const YahooApi = require('..');
const { ServerError } = require('../../../utils/errors');

const logger = log.child({ name: 'yahooApi' });

class YahooAuthApi extends YahooApi {
  static getToken(req, res, refreshToken) {
    return axios({
      method: 'post',
      url: `${yahooUtils.urls.auth}/get_token`,
      headers: {
        Authorization: yahooUtils.createBasicAuthorizationHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        grant_type: refreshToken ? 'refresh_token' : 'authorization_code',
        redirect_uri: process.env.YAHOO_REDIRECT_URI,
        code: refreshToken ? '' : req.query.code,
        refresh_token: refreshToken || '',
      }),
    })
      .then(function parseGetToken(response) {
        const { data } = response;
        const {
          access_token,
          xoauth_yahoo_guid,
          refresh_token,
        } = data;

        logger.debug({
          xoauth_yahoo_guid,
          access_token,
          refresh_token,
        }, 'cred response from yahoo');

        if (!access_token || !xoauth_yahoo_guid || !refresh_token) {
          throw new ServerError('failed to get token from yahoo', req, res, data);
        }

        return {
          accessToken: access_token,
          guid: xoauth_yahoo_guid,
          refreshToken: refresh_token,
        };
      });
  }
}

module.exports = YahooAuthApi;
