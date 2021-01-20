/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
/* eslint linebreak-style: ["error", "windows"] */

const config = require('config');
const nodemailer = require('nodemailer');

const db = require('./config/connection.js');

const { sequelize } = db;

// eslint-disable-next-line prefer-template
// eslint-disable-next-line no-unused-vars
const winston = require(ROOT_DIR + '/winstonlog.js');

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line prefer-template
const Constants = require(ROOT_DIR + '/Constants.js');

exports.sendMail = async function (receiver, subject, text) {
  return new Promise(async (resolve, reject) => {
    const mailOptions = {
      from: config.get('app.emailConfig.user'),

      to: receiver,
      subject,
      text,
    };
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      // service: 'gmail',
      auth: {
        user: 'reports@cabbagesoft.com',
        pass: 'Reports@123',
      },
    });
    try {
      const resp = await transporter.sendMail(mailOptions);
      resolve(resp);
    } catch (err) {
      reject(err);
    }
  });
};

exports.getAuthData = async function () {
  sequelize.query('select role_id,role_name,role_access from mst_role where is_active=1',
    { type: sequelize.QueryTypes.SELECT })
    .then((users) => {
      for (let i = 0; i < users.length; i++) {
        users[i].role_access = JSON.parse(users[i].role_access);
      }
      roleDetails = users;
      return roleDetails;
    });
};

exports.getFunctionality = async function () {
  sequelize.query('select func_id,func_name,priority_level,func_type from mst_functionality where is_active=1',
    { type: sequelize.QueryTypes.SELECT })
    .then((users) => {
      appFunctions = users;
      return appFunctions;
    });
};

exports.getMapdetails = async function () {
  sequelize.query('select id,function,path,access from routing',
    { type: sequelize.QueryTypes.SELECT })
    .then((users) => {
      mapdetails = users;
      return mapdetails;
    });
};
