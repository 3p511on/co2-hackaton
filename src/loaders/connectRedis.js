'use strict';

const { createClient } = require('redis');

module.exports = async () => {
  const client = createClient(process.env.REDIS_URL);

  client.on('error', err => console.error('Redis Client Error', err));
  await client.connect();

  return client;
};
