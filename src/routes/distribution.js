'use strict';

const { Router } = require('express');

const Route = require('../structures/Route');
const checkAuth = require('../utils/checkAuth');

module.exports = class extends Route {
  constructor() {
    super('distribution', '/api');
  }

  register(app) {
    const router = Router();

    router.get('/regions', require('../handlers/distribution/regions/get'));
    router.delete('/regions/:id', checkAuth, require('../handlers/distribution/regions/delete'));
    router.patch('/regions/:id', checkAuth, require('../handlers/distribution/regions/edit'));

    router.get('/dataTypes', require('../handlers/distribution/dataTypes/get'));
    router.delete('/dataTypes/:id', checkAuth, require('../handlers/distribution/dataTypes/delete'));
    router.patch('/dataTypes/:id', checkAuth, require('../handlers/distribution/dataTypes/edit'));

    router.get('/summary', require('../handlers/distribution/summary/get'));
    router.post('/summary', checkAuth, require('../handlers/distribution/summary/create'));
    router.delete('/summary/:id', checkAuth, require('../handlers/distribution/summary/delete'));
    router.patch('/summary/:id', checkAuth, require('../handlers/distribution/summary/edit'));

    app.use(this.path, router);
  }
};
