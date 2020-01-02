const passport = require('passport');
const session = require('express-session');
const YahooStrategy = require('passport-yahoo-oauth2').OAuth2Strategy;

const Database = require('../database');
const log = require('../utils/log');

const logger = log.child({ name: 'auth' });

function yahooPassportCallback(token, tokenSecret, profile, done) {
  logger.info('yahoo passport callback');

  Database.users.findOrCreate({
    yahooId: profile.id,
  })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
}

function setupAuthStrategies(app) {
  // app.use(session({
  //   secret: process.env.SESSION_SECRET,
  //   resave: false,
  //   saveUninitialized: true,
  // }));
  // app.use(passport.initialize());
  // app.use(passport.session());

  // passport.use(new YahooStrategy({
  //   clientID: process.env.YAHOO_CLIENT_ID,
  //   clientSecret: process.env.YAHOO_CLIENT_SECRET,
  //   callbackURL: 'https://82f5ac98.ngrok.io/api/v1/users/auth/yahoo/callback',
  // }, yahooPassportCallback));
}

module.exports = {
  setupAuthStrategies,
};
