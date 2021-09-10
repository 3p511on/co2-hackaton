'use strict';

const checkAuthRaw = require('./checkAuthRaw');

module.exports = async (req, res, next) => {
  try {
    const isOk = checkAuthRaw(req);
    if (!isOk) throw new Error();

    next();
    return true;
  } catch (error) {
    res.status(403).send({ success: false, error: 'Произошла ошибка при проверке авторизации' });
    return false;
  }
};
