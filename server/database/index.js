const admin = require('../utils/firebase');
const log = require('../utils/log');
const UsersDatabase = require('./users');

const logger = log.child({ name: 'database' });

class Database {
  constructor() {
    this.db = admin.firestore();
    logger.debug(this.db, 'initialized');

    this.users = new UsersDatabase(this.db);
  }
}


const db = new Database();

module.exports = db;
