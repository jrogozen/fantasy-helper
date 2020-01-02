const isEmpty = require('lodash/isEmpty');
const pino = require('pino');
const path = require('path');
const stream = require('stream');
const { spawn } = require('child_process');

const { stringPossiblyBoolean } = require('./env');

const cwd = process.cwd();
const logThrough = new stream.PassThrough();
const level = process.env.LOG_LEVEL;
const logPath = stringPossiblyBoolean(process.env.LOG_PATH);
const pretty = stringPossiblyBoolean(process.env.LOG_PRETTY);

class LogFactory {
  constructor() {
    this.pino = LogFactory.createBaseLogger();
    this.children = {};
  }

  static createBaseLogger() {
    const log = pino({
      name: 'fantasy-helper',
      level,
      safe: true,
    }, logThrough);

    if (logPath) {
      const child = spawn(
        process.execPath,
        [
          require.resolve('pino-tee'),
          'debug', `${logPath}/debug.log`,
          'warn', `${logPath}/warn.log`,
          'error', `${logPath}/error.log`,
          'fatal', `${logPath}/fatal.log`,
        ],
        { cwd, env: process.env },
      );

      logThrough.pipe(child.stdin);
    }

    if (pretty) {
      const pinoPrettyPath = path.resolve(
        __dirname,
        '..',
        '..',
        'node_modules/pino-pretty/bin.js',
      );

      const child = spawn(
        process.execPath,
        [require.resolve(pinoPrettyPath), '-c'],
        { cwd, env: process.env },
      );

      logThrough.pipe(child.stdin);

      // child pretty process -> original process stdout (terminal)
      child.stdout.pipe(process.stdout);
    } else {
      logThrough.pipe(process.stdout);
    }

    return log;
  }

  child(bindings) {
    if (isEmpty(bindings) || typeof bindings !== 'object' || !bindings.name) {
      this.pino.error('cannot create a child logger without a name');
      return false;
    }

    if (this.children[bindings.name]) {
      this.pino.trace(`returning existing child logger with name=${bindings.name}`);

      return this.children[bindings.name];
    }

    this.pino.trace(`creating pino child logger with name=${bindings.name}`);

    const logger = this.pino.child(bindings);

    this.children[bindings.name] = logger;

    return logger;
  }
}

const log = new LogFactory();

module.exports = log;
