const errorModel = require(ROOT_DIR + '/lib/error');
// eslint-disable-next-line new-cap
const errorObj = new errorModel();
const Constants = require(ROOT_DIR + '/Constants.js');
// eslint-disable-next-line no-undef
const db = require(ROOT_DIR + '/config/connection.js');
const User = db.users;
const winston = require(ROOT_DIR + '/winstonlog.js');
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const config = require('config');
const Op = sequelize.Op;
const appSecret = config.get('app.secret');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const util = require('../../../util');
const authManager = require('./../../auth/auth');
const validschema = require('../validation/validationSchema');

class UsersManager {
  constructor() { }

  
  async create(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const pass = reqObj.body.password;
        const hashpwd = await bcrypt.hashSync(pass, config.get('app.saltRounds'));
        User.create({
          user_name: data.user_name,
          user_mob: data.user_mob,
          password: hashpwd,
        
        }).then((User) => {
          // Send created customer to client
          resolve(User);
          console.log('created');
        });
      } catch (err) {
        const errResp = await errorObj.errorHander('', err);
        reject(errResp);
      }
    });
  }
}

module.exports = UsersManager;
