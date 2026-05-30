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
    const newRegisterUser = {
      username: 'mluukkai',
      password: 'salainen',
      name: 'Matti'
    };

    await api.post('/api/auth/register').send(newRegisterUser).expect(201);

    const allUsers = await getAllData({ model: User });
    const newlyCreatedUser = allUsers.find(u => u.username === 'mluukkai');
    assert.strictEqual(newlyCreatedUser.username, 'mluukkai');
  });

  test('User doing login with username and password just created', async () => {
    await api
      .post('/api/auth/register')
      .send({
        username: 'mluukkai',
        password: 'salainen',
        name: 'Matti'
      })
      .expect(201);

    const userLoginData = {
      username: 'mluukkai',
      password: 'salainen'
    };
    await api.post('/api/auth/login').send(userLoginData).expect(200);
  });
});
