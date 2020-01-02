const express = require('express');

// must be first
require('../tools/utils/loadEnv');
const log = require('./utils/log');
const setRequestParsers = require('./middleware/generic/requestParsers');
const secureRequest = require('./middleware/generic/secureRequest');
const useHttpLogger = require('./middleware/generic/httpLogger');
const setErrorMiddleware = require('./middleware/errors');
const Database = require('./database');
const { ServerError } = require('./utils/errors');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';
const compileClient = isDev && !process.env.SERVER_ONLY;
const logger = log.child({ name: 'server' });

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

const db = new Database();

/* test */
app.use('/ok', (req, res) => {
  res.send('ok');
});
app.use('/notok', (req, res) => {
  throw new ServerError('woah a server error', req, res);
});

// must be last middleware
setErrorMiddleware(app);

app.listen(process.env.PORT, () => {
  logger.info(`example app listening on port=${process.env.PORT}`);
});
