const User = require('./models/user');
const { DatabaseError } = require('../utils/errors');
const log = require('../utils/log');

const logger = log.child({ name: 'database' });

class UsersDatabase {
  constructor(db) {
    this.db = db;
  }

  findOrCreate(data) {
    const user = new User(data);

    if (!user.guid) {
      throw new DatabaseError('cannot get or create user without yahooId');
    }

    const usersRef = this.db.collection('users');

    return usersRef
      .where('guid', '==', user.guid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          logger.info('no user found with guid=%s, creating new user', user.guid);

          const definedFields = user.getDefinedFields();

          return usersRef.add(definedFields);
        }

        let foundUser;

        snapshot.forEach((doc) => {
          foundUser = doc.data();
        });

        logger.info('found user with guid=%s, returning data', user.guid);

        return foundUser;
      });
  }
}

module.exports = UsersDatabase;
