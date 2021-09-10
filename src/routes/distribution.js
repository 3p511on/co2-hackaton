'use strict';

const { Router } = require('express');

const dataTypesHandler = require('../handlers/distribution/dataTypes');
const regionsHandler = require('../handlers/distribution/regions');
const summaryHandler = require('../handlers/distribution/summary');

const Route = require('../structures/Route');

module.exports = class extends Route {
  constructor() {
    super('distribution', '/api');
  }

  register(app) {
    const router = Router();

    router.get('/regions', regionsHandler);
    router.get('/dataTypes', dataTypesHandler);
    router.get('/summary', summaryHandler);

    app.use(this.path, router);
  }
};
