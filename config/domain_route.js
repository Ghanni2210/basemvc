/* eslint linebreak-style: ["error", "windows"] */

const express = require('express');
const config = require('config');

const app = express();

const jsonRoute = require('json-routing');
const _ = require('underscore');

const modules = _.where(config.app.modules, { enable: true });

module.exports = () => {
  /** ****************api-versioning******************** */
  let routeInfo = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const model of modules) {
    routeInfo = {
      routesPath: `./app/${model.name}/routes/v1/`,
      controllersPath: `./app/${model.name}/controllers/`,
      policyPath: './app/auth/',
      cors: false,
    };
    new jsonRoute.JsonRoute(app, routeInfo).start();
  }
  /** ************************************************** */

  const domains = {
    domains: [
      { domain_name: config.get('app.issuer'), object: app },
    ],
  };
  return domains;
};
