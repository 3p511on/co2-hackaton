'use strict';

const { ADMIN_PASSWORD } = process.env;

module.exports = (req, res) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      res.status(400).send({ success: false, error: 'Пароль не указан' });
      return false;
    }

    if (password !== ADMIN_PASSWORD) {
      res.status(401).send({ success: false, error: 'Пароль не указан неверно' });
      return false;
    }

    res.cookie('token', Date.now(), { signed: true });

    res.status(200).send({ success: true });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message ?? err });
    return false;
  }
};
