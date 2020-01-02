const { ERROR_CODES } = require('../../../shared/utils/errors');

class DatabaseError extends Error {
  constructor(message, args) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    this.name = 'DatabaseError';
    this.code = ERROR_CODES.databaseError;
    this.data = {
      ...args,
    };
  }
}

module.exports = DatabaseError;
