/* eslint-disable max-len */
/* eslint linebreak-style: ["error", "windows"] */

const appRoot = require('app-root-path');
const winston = require('winston');


const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  // eslint-disable-next-line no-unused-vars
  write(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
