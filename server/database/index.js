const admin = require('../utils/firebase');
const log = require('../utils/log');

const logger = log.child({ name: 'database' });

class Database {
  constructor() {
    this.db = admin.firestore();
    logger.info(this.db, 'initialized');
  }
}

module.exports = Database;
