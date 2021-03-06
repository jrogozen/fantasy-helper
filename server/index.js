const app = require('./app');
const log = require('./utils/log');

const logger = log.child({ name: 'server' });

app.listen(process.env.PORT, () => {
  logger.info(`fantasy-helper app listening on port=${process.env.PORT}`);
});
