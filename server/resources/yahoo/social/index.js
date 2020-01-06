const axios = require('axios');

const yahooUtils = require('../../../utils/apis/yahoo');
const YahooApi = require('..');

// const log = require('../../../utils/log');
// const logger = log.child({ name: 'yahooApi' });

class YahooSocialApi extends YahooApi {
  constructor(args) {
    super(args);
    this.guid = args.guid;
  }

  profile() {
    return axios({
      method: 'get',
      url: `${yahooUtils.urls.user}/${this.guid}/profile?format=json`,
      headers: {
        Authorization: yahooUtils.createBearerAuthorizationHeader(this.accessToken),
      },
    });
  }
}

module.exports = YahooSocialApi;
