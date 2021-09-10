'use strict';

module.exports = req => {
  // Token is timestamp, when user signed up
  const token = req?.signedCookies?.token;
  if (!token) return false;

  // Check session time
  if (Date.now() - token > 30 * 60 * 1000) return false;
  return true;
};
