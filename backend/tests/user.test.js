const { describe, test, beforeEach, before, after } = require('node:test');
const { usersInDb, initializeUsers } = require('./user_test_helper');
const supertest = require('supertest');
const app = require('../app');
const { connectIfNeeded, closeConnection } = require('../utils/config');
const assert = require('node:assert');

const api = supertest(app);

before(async () => {
  await connectIfNeeded();
});
beforeEach(async () => {
  await initializeUsers();
});

after(async () => {
  await closeConnection();
});

describe('when theres one user on the database', () => {
  test.only('creation users success with a fresh username', async () => {
    const userAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      password: 'salainen',
      name: 'Matti Luukkainen'
    };

    await api
      .post('/api/users/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, userAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test.only('creation users fails with username that already exists', async () => {
    const usersAtStart = await usersInDb();
    const newUser = {
      username: 'root',
      password: 'sekret',
      name: 'Superuser'
    };
    const result = await api.post('/api/users/signup').send(newUser);
    assert.strictEqual(result.status, 400);
    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
