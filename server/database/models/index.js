const isUndefined = require('lodash/isUndefined');

class Model {
  getDefinedFields() {
    return Object.getOwnPropertyNames(this).reduce((acc, field) => {
      if (isUndefined(this[field])) {
        return acc;
      }

      acc[field] = this[field];
      return acc;
    }, {});
  }
}

module.exports = Model;
