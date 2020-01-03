const axios = require('axios');

const log = require('../../utils/log');
const yahooUtils = require('../../utils/apis/yahoo');

const logger = log.child({ name: 'yahooApi' });

/*
  games = sport (string) or sport + year (key). e.g. 'nfl' or '243'. nothing to do with the user
  leagues = a game's leagues, query by user + game_key. e.g. 'nfl'
  teams = actual teams for a league, query by game_keys
*/
class YahooApi {
  constructor(args) {
    this.accessToken = args.accessToken;
    this.user = {
      leagues: this.leagues.bind(this),
    };
  }

  static makeRequestUrl(resources = []) {
    const suffix = resources.reduce((acc, resource) => {
      if (!resource.filter) {
        acc += `/${resource.name}`;
      } else {
        acc += `/${resource.name};${resource.filter}`;
      }

      return acc;
    }, '');

    return `${yahooUtils.urls.fantasy}${suffix}?format=json`;
  }

  // static parseCollection(collection) {
  // }

  leagues({ gameKeys }) {
    if (!Array.isArray(gameKeys)) {
      gameKeys = [gameKeys];
    }

    const url = YahooApi.makeRequestUrl([
      { name: 'users', filter: 'use_login=1' },
      { name: 'games', filter: `game_keys=${gameKeys.join(',')}` },
      { name: 'leagues' },
    ]);

    return axios({
      method: 'get',
      url,
      headers: {
        Authorization: yahooUtils.createBearerAuthorizationHeader(this.accessToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        const { data } = response;
        logger.info(data, 'yahoo response');

        return data;
      });
  }
}

module.exports = YahooApi;
