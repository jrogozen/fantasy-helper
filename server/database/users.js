const User = require('./models/user');
const log = require('../utils/log');
const { DatabaseError } = require('../utils/errors');

const logger = log.child({ name: 'database' });

class UsersDatabase {
  constructor(db) {
    this.db = db;
  }

  findOrCreate(data, onlyFind = false) {
    const user = new User(data);

    if (!user.yahooGuid) {
      throw new DatabaseError('cannot get or create user without yahooId');
    }

    const usersRef = this.db.collection('users');

    return usersRef
      .where('yahooGuid', '==', user.yahooGuid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty && !onlyFind) {
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

        // user not found and do not create
        if (snapshot.empty && onlyFind) {
          return null;
        }

        // user found, return
        let foundUser;

        snapshot.forEach((doc) => {
          foundUser = doc.data();
        });

        logger.info('found user with yahooGuid=%s, returning data', user.yahooGuid);

        return new User(foundUser);
      });
  }
}

module.exports = UsersDatabase;
