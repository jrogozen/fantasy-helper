const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

function setRequestParsers(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
}

module.exports = setRequestParsers;
