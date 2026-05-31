'use strict';
const { beforeEach, before, after } = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/users');
const { seedUser, loginUser } = require('./test.login.data');
const { startConnection, closeConnection } = require('../core/databaseConfig');
const { deleteData } = require('../core/mongoQueryHelper');

const api = supertest(app);

const setupDB = () => {
  before(async () => {
    await startConnection();
  });

  beforeEach(async () => {
    await deleteData({ allData: true, model: User });
    await api.post('/api/auth/register').send(seedUser).expect(201);
  });

  after(async () => {
    await closeConnection();
  });
};

const loginAndGetToken = async () => {
  const res = await api.post('/api/auth/login').send(loginUser).expect(200);
  return res.body.token;
};

module.exports = { api, setupDB, loginAndGetToken, seedUser, loginUser };
