const axios = require('axios');

const log = require('../../utils/log');
const yahooUtils = require('../../utils/apis/yahoo');

const logger = log.child({ name: 'yahooApi' });

class YahooUserApi {
  // pass in YahooApi class to get around circular dependency
  constructor(accessToken, YahooApi) {
    this.accessToken = accessToken;
    this.YahooApi = YahooApi;
  }

  static parseResource(root) {
    const games = [];

    const queue = [[root, games]];

    while (queue.length) {
      const item = queue.shift();
      const indexedObj = item[0];
      const parentResults = item[1];

      for (let i = 0; i < indexedObj.count; i++) {
        const resourceName = Object.keys(indexedObj[i])[0];
        const resource = indexedObj[i][resourceName];
        const stats = resource[0];
        const isMultiResource = Array.isArray(stats);
        const subResource = resource[1];

        let resourceResults = {};

        if (isMultiResource) {
          const multiResourceResults = {};

          for (let j = 0; j < stats.length; j++) {
            const obj = stats[j];
            const multiResourceKey = Object.keys(obj);

            multiResourceKey.forEach((n) => {
              multiResourceResults[n] = stats[j][n];
            });
          }

          resourceResults = {
            ...multiResourceResults,
          };
        } else {
          resourceResults = {
            ...stats,
          };
        }

        parentResults.push(resourceResults);

        if (subResource) {
          const subResourceName = Object.keys(resource[1])[0];

          resourceResults[subResourceName] = [];

          queue.push(
            [resource[1][subResourceName], resourceResults[subResourceName]],
          );
        }
      }
    }

    return {
      games,
    };
  }

  // user collections are always organized by games
  static parseUserCollection(data) {
    const user = data.fantasy_content.users[0].user[0];
    const { games } = data.fantasy_content.users[0].user[1];

    const organizedCollection = YahooUserApi.parseResource(games);

    return {
      user,
      ...organizedCollection,
    };
  }

  leagues({ gamesFilter }) {
    const url = this.YahooApi.makeRequestUrl([
      { name: 'users', filter: 'use_login=1' },
      { name: 'games', filter: gamesFilter },
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
      .then((response) => YahooUserApi.parseUserCollection(response.data))
      .catch((error) => {
        throw yahooUtils.transformYahooResponseErrors(error);
      });
  }

  teams({ gamesFilter, noLeagues = false }) {
    const url = this.YahooApi.makeRequestUrl([
      { name: 'users', filter: 'use_login=1' },
      { name: 'games', filter: gamesFilter },
      noLeagues ? null : { name: 'leagues' },
      { name: 'teams' },
    ]);

    return axios({
      method: 'get',
      url,
      headers: {
        Authorization: yahooUtils.createBearerAuthorizationHeader(this.accessToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => YahooUserApi.parseUserCollection(response.data))
      .catch((error) => {
        throw yahooUtils.transformYahooResponseErrors(error);
      });
  }
}

module.exports = YahooUserApi;
