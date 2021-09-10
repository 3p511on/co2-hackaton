'use strict';

const { Router } = require('express');

const Route = require('../structures/Route');

const welcomeHandler = require('../handlers/panel/[index]');

module.exports = class extends Route {
  constructor() {
    super('');
  }

  register(app) {
    const router = Router();

    // Welcome page
    // TODO: Redirect to panel if logged in
    router.get('/', welcomeHandler);

    app.use(this.path, router);
  }
};
