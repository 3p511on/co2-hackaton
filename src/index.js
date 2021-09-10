'use strict';

require('dotenv').config();

const HTTPLoader = require('./HTTPLoader');

const server = new HTTPLoader();
server.initialize();
