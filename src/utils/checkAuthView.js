'use strict';

const checkAuthRaw = require('./checkAuthRaw');

module.exports = async (req, res, next) => {
  const checkAuth = await checkAuthRaw(req);
  if (!checkAuth) return res.redirect('/');
  return next();
};
