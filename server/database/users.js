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

    if (!user.yahooGuid) {
      throw new DatabaseError('cannot get or create user without yahooId');
    }

    const usersRef = this.db.collection('users');

    return usersRef
      .where('yahooGuid', '==', user.yahooGuid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          logger.info('no user found with yahooGuid=%s, creating new user', user.yahooGuid);

          const definedFields = {
            ...user.getDefinedFields(),
            createdAt: Date.now(),
          };

          return usersRef.add(definedFields)
            .then((ref) => ({
              ...definedFields,
              id: ref.id,
            }));
        }

        let foundUser;

        snapshot.forEach((doc) => {
          foundUser = doc.data();
        });

        logger.info('found user with yahooGuid=%s, returning data', user.yahooGuid);

        return foundUser;
      });
  }
}

module.exports = UsersDatabase;
