const merge = require('lodash/merge');
const base = require('./base');

const production = merge(base, {
  build: {

  },
  run: {

  },
});

module.exports = production;
