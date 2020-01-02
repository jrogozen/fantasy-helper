require('dotenv').config();

const path = require('path');
const pretty = require('prettyjson');

const env = process.env.ENV_TYPE || 'local';
const configPath = path.resolve(__dirname, '..', 'environments', `${env}.js`);

const defaults = require(configPath);

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

  console.log(pretty.render(print));
}

console.log('\n--= printing build time env =---');
prettyPrint(defaults.build, 'build');

console.log('\n--= printing run time env =---');
prettyPrint(defaults.run, 'run');
console.log('\n');
