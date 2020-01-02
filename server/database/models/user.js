// todo: extend a model class that has things like getDefinedFields
class User {
  constructor(args) {
    this.nickname = args.nickname;
    this.email = args.email;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.createdAt = args.createdAt;

    this.yahooRefreshToken = args.yahooRefreshToken;
    this.yahooGuid = args.yahooGuid;
  }

  getDefinedFields() {
    return Object.getOwnPropertyNames(this).reduce((acc, field) => {
      if (this[field]) {
        acc[field] = this[field];
      }

      return acc;
    }, {});
  }
}

module.exports = User;
