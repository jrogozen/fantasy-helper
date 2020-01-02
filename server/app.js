const express = require('express');

// must be first
require('../tools/utils/loadEnv');
const yahooAuthApi = require('./auth/yahoo');
const userApi = require('./api/users');
const setRequestParsers = require('./middleware/generic/requestParsers');
const secureRequest = require('./middleware/generic/secureRequest');
const useHttpLogger = require('./middleware/generic/httpLogger');
const setErrorMiddleware = require('./middleware/errors');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';
const compileClient = isDev && !process.env.SERVER_ONLY;

/* only in development
use webpack dev middleware to compile and serve frontend assets
*/
if (compileClient) {
  const config = require('../tools/build/webpack/webpack.config.js');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

setRequestParsers(app);
secureRequest(app);
useHttpLogger(app);

app.use('/check', (req, res) => {
  res.send('ok');
});

/* auth routes */
app.use('/api/v1/auth/yahoo', yahooAuthApi);

/* routes */
app.use('/api/v1/users', userApi);

// must be last middleware
setErrorMiddleware(app);

module.exports = app;
