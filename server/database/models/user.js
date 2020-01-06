const Model = require('./');

class User extends Model {
  constructor(args) {
    super();

    this.nickname = args.nickname;
    this.email = args.email;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.createdAt = args.createdAt;

    this.yahooRefreshToken = args.yahooRefreshToken;
    this.yahooGuid = args.yahooGuid;
  }

  getPublicDetails() {
    return {
      nickname: this.nickname,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
