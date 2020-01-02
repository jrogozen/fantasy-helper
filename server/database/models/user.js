const axios = require('axios');
const querystring = require('querystring');

const log = require('../../utils/log');
const Model = require('./');
const yahooUtils = require('../../utils/apis/yahoo');

const logger = log.child({ name: 'model' });

class User extends Model {
  constructor(args) {
    super();

    this.nickname = args.nickname;
    this.email = args.email;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.createdAt = args.createdAt;

    this.yahooRefreshToken = args.yahooRefreshToken;
    this.yahooGuid = args.yahooGuid;
  }

  getPublicDetails() {
    return {
      nickname: this.nickname,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  getYahooAccessToken() {
    return axios({
      method: 'post',
      url: yahooUtils.urls.getToken,
      headers: {
        Authorization: yahooUtils.createBasicAuthorizationHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        grant_type: 'refresh_token',
        redirect_uri: process.env.YAHOO_REDIRECT_URI,
        refresh_token: this.yahooRefreshToken,
      }),
    })
      .then(function parseGetToken(response) {
        const { data } = response;
        const {
          access_token,
          xoauth_yahoo_guid,
        } = data;

        logger.debug({ access_token, xoauth_yahoo_guid }, 'got new access token for user');

        if (!access_token) {
          throw new Error('could not get new access_token from yahoo');
        }

        return { accessToken: access_token };
      });
  }
}

module.exports = User;
