require('dotenv').config();

const path = require('path');
const pretty = require('prettyjson');

let env = 'local';

if (process.env.ENV_TYPE) {
  env = process.env.ENV_TYPE;
}

if (process.env.GCLOUD_PROJECT) {
  env = 'production';
}

if (!process.env.NODE_ENV && env === 'local') {
  process.env.NODE_ENV = 'development';
} else {
  process.env.NODE_ENV = 'production';
}

const configPath = path.resolve(__dirname, '..', 'environments', `${env}.js`);

const defaults = require(configPath);

function handleFirebaseEnv(print) {
  // running on gcloud
  if (process.env.GCLOUD_PROJECT) {
    const functions = require('firebase-functions');

    // handle yahoo auth
    process.env.YAHOO_CLIENT_ID = functions.config().yahoo.client_id;
    process.env.YAHOO_CLIENT_SECRET = functions.config().yahoo.client_secret;

    if (print.YAHOO_CLIENT_ID) {
      print.YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
    }
    if (print.YAHOO_CLIENT_SECRET) {
      print.YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
    }
  }
}

function prettyPrint(options, configKey) {
  const print = Object.keys(options).reduce((acc, name) => {
    if (!process.env[name]) {
      process.env[name] = defaults[configKey][name];
    }

    const data = {
      value: process.env[name],
      type: typeof process.env[name],
    };

    acc[name] = data;

    return acc;
  }, {});

  handleFirebaseEnv(print);

  console.log(pretty.render(print));
}

console.log('\n--= printing build time env =---');
prettyPrint(defaults.build, 'build');

console.log('\n--= printing run time env =---');
prettyPrint(defaults.run, 'run');
console.log('\n');
