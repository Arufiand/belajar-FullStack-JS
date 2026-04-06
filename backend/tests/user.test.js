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
  // Test for SUCCESS
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();
    const newUser = {
      username: 'mluukkai',
      password: 'salainen',
      name: 'Matti'
    };

    await api.post('/api/users/signup').send(newUser).expect(201);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

  // Test for DUPLICATE (Invalid)
  test('creation fails if username already exists', async () => {
    const usersAtStart = await usersInDb();
    const newUser = { username: 'root', password: 'sekret', name: 'Superuser' };

    const result = await api
      .post('/api/users/signup')
      .send(newUser)
      .expect(400);

    // Validate error message as requested by the prompt
    assert(result.body.error.includes('username must be unique'));

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  // Test for LENGTH (Invalid)
  test('creation fails if username/password are too short', async () => {
    const usersAtStart = await usersInDb();
    const newUser = { username: 'lu', password: '12', name: 'Shorty' };

    const result = await api
      .post('/api/users/signup')
      .send(newUser)
      .expect(400);

    // Validate specific error message
    assert(
      result.body.error.includes('too short') ||
        result.body.error.includes('at least 3')
    );

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
