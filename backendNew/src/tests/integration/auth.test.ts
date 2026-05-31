'use strict';

import { describe, test } from 'node:test';
import { getAllData } from '../../core/mongoQueryHelper';
import User from '../../models/users';
import assert from 'node:assert';
import { api, setupDB, seedUser, loginUser } from '../test.helper';

setupDB();

describe('Registration and Authentication ', () => {
  test('User Doing Registration', async () => {
    // seedUser is already registered by setupDB's beforeEach
    const allUsers = await getAllData({ model: User });
    const newlyCreatedUser = allUsers.find(
      u => u.username === seedUser.username
    );
    assert.strictEqual(newlyCreatedUser.username, seedUser.username);
  });

  test('User doing login with username and password just created', async () => {
    // seedUser is already registered by setupDB's beforeEach
    await api.post('/api/auth/login').send(loginUser).expect(200);
  });
});
