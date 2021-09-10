'use strict';

module.exports = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};
