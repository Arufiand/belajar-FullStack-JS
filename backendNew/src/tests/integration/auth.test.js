const { describe, test, beforeEach, before, after } = require('node:test');
const { getAllData } = require('../../core/mongoQueryHelper');
const User = require('../../models/users');

const supertest = require('supertest');
const app = require('../../app');
const assert = require('node:assert');
const {
  startConnection,
  closeConnection
} = require('../../core/databaseConfig');
const { seedUser, loginUser } = require('../test.login.data');
const api = supertest(app);

before(async () => {
  await startConnection();
});

beforeEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  await closeConnection();
});

describe('Registration and Authentication ', () => {
  test('User Doing Registration', async () => {
    await api.post('/api/auth/register').send(seedUser).expect(201);

    const allUsers = await getAllData({ model: User });
    const newlyCreatedUser = allUsers.find(u => u.username === 'mluukkai');
    assert.strictEqual(newlyCreatedUser.username, 'mluukkai');
  });

  test('User doing login with username and password just created', async () => {
    await api.post('/api/auth/register').send(seedUser).expect(201);
    await api.post('/api/auth/login').send(loginUser).expect(200);
  });
});
