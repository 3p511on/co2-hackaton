'use strict';

require('dotenv').config();

const importDataset = require('./handlers/importDataset');
const needToImport = require('./handlers/needToImport');

const HTTPLoader = require('./loaders/HTTPLoader');
const connectRedis = require('./loaders/connectRedis');

module.exports = class Main {
  constructor() {
    this.database = null;
    this.connectDatabase();

    this.httpServer = new HTTPLoader(this);
    this.httpServer.initialize();
  }

  async connectDatabase() {
    this.database = await connectRedis();
    console.log('Redis connected');

    this.syncDatabase();
    return this;
  }

  async syncDatabase() {
    const alreadyImported = await needToImport(this);
    if (alreadyImported) return true;
    importDataset(this);
    return true;
  }
};
