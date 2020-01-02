const pinoHttp = require('pino-http');
const log = require('../../utils/log');

// const app = express();
const httpLogger = pinoHttp({
  logger: log.child({ name: 'httpLogger' }),
  customLogLevel(res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }

    return 'info';
  },
});

function useHttpLogger(app) {
  app.use(httpLogger);
}

module.exports = useHttpLogger;
