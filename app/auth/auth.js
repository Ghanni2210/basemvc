/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable import/no-dynamic-require */

const jwt = require('jsonwebtoken');
const config = require('config');

const appSecret = config.get('app.secret');
// const tokenExpiresIn = config.get('app.auth.expires');
const tokenIssuer = config.get('app.auth.issuer');
// eslint-disable-next-line no-undef
const Constants = require(`${ROOT_DIR}/Constants.js`);
// eslint-disable-next-line no-undef
const winston = require(`${ROOT_DIR}/winstonlog.js`);

// eslint-disable-next-line no-unused-vars
exports.generateToken = (userData, options) => {
  const token = jwt.sign({
    userId: userData.user_id.toString(),
    roleId: userData.role_id.toString(),
    roleName: userData.role_name,
    mobile: userData.user_mob,
    email: userData.user_email,
    compId: userData.comp_id.toString(),
    userName: userData.user_name,
  }, appSecret, {
    // expiresIn : options.expires || tokenExpiresIn,
    issuer: tokenIssuer,
  });
  // eslint-disable-next-line no-console
  console.log('Generate token');
  return token;
};

exports.verifyToken = async (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Verify token');
  let decoded = false;
  try {
    if (req.headers['access-token']) { // Token extracted from header
      decoded = await jwt.verify(req.headers['access-token'], appSecret);// Validating token (DECRYPT TOKEN)
    } else {
      winston.error('In verify token token was not provided ');// Token not provided in header
      const resp = {
        status: Constants.statusOK,
        data: {
          API_status: Constants.statusinvaliduser_code,
          API_message: Constants.Invalid_user_msg,
          API_URL: '',
          API_data: null,
        },
      };
      return res.json(resp);
    }
  } catch (err) {
    winston.error('In verify token error occured while decoding token ', err);
    const resp = {
      status: Constants.statusOK,
      data: {
        API_status: Constants.statusfail_code,
        API_message: Constants.fail_msg,
        API_URL: '',
        API_data: null,
      },
    };
    return res.json(resp);
  }
  let isVerified = 0;
  if (decoded) { // Token validated and info was decoded
    try {
      const url = req.originalUrl;// Url endpoint
      const userRoleName = decoded.roleName;

      // eslint-disable-next-line no-var
      // eslint-disable-next-line no-undef
      var mapdataindex = mapdetails.findIndex(obj => obj.path === url);// Checking url in routing(exist or not) and getting index of that url
      if (mapdataindex !== -1) { // findIndex return -1 if object value does not exist or return index where object value exist
        // eslint-disable-next-line no-undef
        var roleindex = roleDetails.findIndex(obj => obj.role_name === userRoleName);// return index where value is located(userRoleName i.e User,Admin)
        if (roleindex !== -1) {
          const roleLevelAccess = roleDetails[roleindex].role_access[url.split('/')[1]];
          // eslint-disable-next-line no-undef
          const apiLevelAccess = mapdetails[mapdataindex].access;
          if (roleLevelAccess === apiLevelAccess || Constants.access_rights.indexOf[roleLevelAccess] > Constants.access_rights.indexOf[apiLevelAccess]) { isVerified = 1; }// if rolelevel and apilevel both have same level or rolelevel  has greater value then apilevel
        }
      }
    } catch (err) {
      winston.error('In verify token error occured while checking access ', err);
    }
  }

  if (isVerified === 0) {
    winston.error('In verify token access was denied ');
    const resp = {
      status: Constants.statusOK,
      data: {
        API_status: Constants.statusfail_code,
        API_message: Constants.access_denied_msg,
        API_URL: '',
        API_data: null,
      },
    };

    return res.json(resp);
  } if (isVerified === 1) { // all criteria passed and now decoding value from token
    req.roleId = decoded.roleId;
    req.userId = decoded.userId;
    req.compId = decoded.compId;
    req.mobile = decoded.mobile;
    req.email = decoded.email;
    req.userName = decoded.userName;

    return next();
  } else {
    winston.error('In verify token user was invalid or token was not provided');
    const resp = {
      status: Constants.statusOK,
      data: {
        API_status: Constants.statusfail_code,
        API_message: Constants.fail_msg,
        API_URL: '',
        API_data: null,
      },
    };
    return res.json(resp);
  }
};

exports.verifyWithoutToken = async (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Verify token');
  try {
    if (req.headers.module) { // Token extracted from header
      let isVerified = 0;
      try {
        const url = req.originalUrl;// Url endpoint
        const userRoleName = req.headers.module;
        // eslint-disable-next-line no-var
        // eslint-disable-next-line no-undef
        var mapdataindex = mapdetails.findIndex(obj => obj.path === url);// Checking url in routing(exist or not) and getting index of that url
        if (mapdataindex !== -1) { // findIndex return -1 if object value does not exist or return index where object value exist
          // eslint-disable-next-line no-undef
          var roleindex = roleDetails.findIndex(obj => obj.role_name === userRoleName);// return index where value is located(userRoleName i.e User,Admin)
          if (roleindex !== -1) {
            const roleLevelAccess = roleDetails[roleindex].role_access[mapdetails[0].function];
            // eslint-disable-next-line no-undef
            const apiLevelAccess = mapdetails[mapdataindex].access;
            if (roleLevelAccess === apiLevelAccess || Constants.access_rights.indexOf[roleLevelAccess] > Constants.access_rights.indexOf[apiLevelAccess]) { isVerified = 1; }// if rolelevel and apilevel both have same level or rolelevel  has greater value then apilevel
          }
        }
      } catch (err) {
        winston.error('In verify token error occured while checking access ', err);
      }
      if (isVerified) {
        return next();
      } else {
        winston.error('In verify token access was denied ');
        const resp = {
          status: Constants.statusOK_code,
          data: {
            API_status: Constants.statusfail_code,
            API_message: Constants.access_denied_msg,
            API_URL: '',
            API_data: null,
          },
        };

        return res.json(resp);
      }
    } else {
      const resp = {
        status: Constants.statusOK_code,
        data: {
          API_status: Constants.statusinvaliduser_code,
          API_message: Constants.Invalid_user_msg,
          API_URL: '',
          API_data: null,
        },
      };
      return res.json(resp);
    }
  } catch (err) {
    const resp = {
      status: Constants.statusOK_msg,
      data: {
        API_status: Constants.statusinvaliduser_code,
        API_message: Constants.Invalid_user_msg,
        API_URL: '',
        API_data: null,
      },
    };
    return res.json(resp);
  }
};
