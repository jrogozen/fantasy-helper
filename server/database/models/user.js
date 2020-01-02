// const bcrypt = require('bcrypt');
class User {
  constructor(args) {
    this.nickname = args.nickname;
    this.email = args.email;
    this.profileImage = args.profileImage;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.refreshToken = args.refreshToken;
    this.guid = args.guid;
  }

  getDefinedFields() {
    return Object.getOwnPropertyNames(this).reduce((acc, field) => {
      if (this[field]) {
        acc[field] = this[field];
      }

      return acc;
    }, {});
  }

  // encryptPassword() {
  //   return new Promise((resolve, reject) => {
  //     bcrypt.hash(this.password, 10, (err, hash) => {
  //       if (err) {
  //         reject(new DatabaseError('could not hash password', {
  //           email: this.email,
  //           password: this.password,
  //         }));
  //       }

  //       this.password = hash;

  //       resolve(this);
  //     });
  //   });
  // }
}

module.exports = User;
