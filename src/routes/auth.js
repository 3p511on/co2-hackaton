'use strict';

const { Router } = require('express');

const Route = require('../structures/Route');
const checkAuth = require('../utils/checkAuth');

module.exports = class extends Route {
  constructor() {
    super('auth', '/api');
  }

  register(app) {
    const router = Router();

    router.post('/login', require('../handlers/auth/login'));
    router.get('/logout', checkAuth, require('../handlers/auth/logout'));

    app.use(this.path, router);
  }
};
