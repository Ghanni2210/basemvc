const user = require('../models/users');
// const Promise = require('promise');

const userManager = new user();

exports.create = async (req, res) => {
  const userData = await userManager.create(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.set({ 'Access-Token': userData.token });
  res.json(userData.userData);
};
