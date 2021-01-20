/* eslint-disable class-methods-use-this */
/* eslint linebreak-style: ["error", "windows"] */

const wiinston = require('../winstonlog');

class ErrorHandler {
  validationError(err) {
    const errResp = {
      type: 'ValidationError',
      message: err.message,
    };
    return this.badRequestResp(errResp);
  }

  tryCatchError(err) {
    const errResp = {
      type: 'serverError',
      message: err.message,
    };
    return this.serverErrorResp(errResp);
  }

  customError(code, customcode, err, errmsg, logerr) {
    const errorCode = Math.floor(100000 + Math.random() * 90000);
    wiinston.error(`Error no =>#${errorCode}# Msg=> ${errmsg}, err=> ${logerr}`);
    const errResp = {
      status: customcode,
      data: {
        API_status: customcode,
        API_message: err.message,
        API_URL: '',
        API_data: null,
        API_code: errorCode,
      },
    };
    return this.customErrorResp(code, errResp);
  }

  errorHander(code, customcode, err, errmsg, logerr) {
    if (code) {
      return this.customError(code, customcode, err, errmsg, logerr);
    }
    if (err.name === 'ValidationError') {
      return this.validationError(err);
    }

    return this.tryCatchError(err);
  }

  badRequestResp(errData) {
    return {
      respHeadersStatus: 400,
      respParams: errData,
    };
  }

  serverErrorResp(errData) {
    return {
      respHeadersStatus: 500,
      respParams: errData,
    };
  }

  customErrorResp(code, errData) {
    return {
      respHeadersStatus: code,
      respParams: errData,
    };
  }
}

module.exports = ErrorHandler;
