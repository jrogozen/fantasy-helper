const YahooApi = require('..');
const YahooFantasyUserApi = require('./user');
const yahooUtils = require('../../../utils/apis/yahoo');
const log = require('../../../utils/log');

const logger = log.child({ name: 'yahooApi' });

/*
  games = sport (string) or sport + year (key). e.g. 'nfl' or '243'. nothing to do with the user
  leagues = a game's leagues, query by user + game_key. e.g. 'nfl'
  teams = actual teams for a league, query by game_keys
*/
class YahooFantasyApi extends YahooApi {
  constructor(args) {
    super(args);

    this.user = new YahooFantasyUserApi(this.accessToken, YahooFantasyApi);
  }

  static makeRequestUrl(resources = []) {
    const suffix = resources.reduce((acc, resource) => {
      if (!resource) {
        return acc;
      }

      if (!resource.filter) {
        acc += `/${resource.name}`;
      } else {
        acc += `/${resource.name};${resource.filter}`;
      }

      return acc;
    }, '');

    const requestUrl = `${yahooUtils.urls.fantasy}${suffix}?format=json`;

    logger.info('making request to yahoo api=%s', requestUrl);

    return requestUrl;
  }
}

module.exports = YahooFantasyApi;
