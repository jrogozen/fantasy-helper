const admin = require('../utils/firebase');
const log = require('../utils/log');
const UsersDatabase = require('./users');

const logger = log.child({ name: 'database' });

class Database {
  constructor() {
    this.db = admin.firestore();
    this.users = new UsersDatabase(this.db);

    logger.debug('initialized db with projectId=%s', this.db._settings.projectId);
  }
}


const db = new Database();

module.exports = db;
