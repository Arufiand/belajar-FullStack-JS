'use strict';

import { describe, test } from 'node:test';
import { getAllData } from '../../core/mongoQueryHelper';
import User from '../../models/users';
import assert from 'node:assert';
import { api, setupDB, seedUser, loginAndGetToken } from '../test.helper';

setupDB();

describe('Users API', () => {
  describe('GET /api/users', () => {
    test('returns all users as JSON', async () => {
      const res = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(Array.isArray(res.body), true);
      assert.strictEqual(res.body.length, 1);
    });
  });

  describe('GET /api/users/:id', () => {
    test('returns a single user by id', async () => {
      const allUsers = await getAllData({ model: User });
      const id = allUsers[0].id;

      const res = await api.get(`/api/users/${id}`).expect(200);
      assert.strictEqual(res.body.username, seedUser.username);
    });

    test('returns 404 for non-existing id', async () => {
      await api.get('/api/users/000000000000000000000000').expect(404);
    });
  });

  describe('PUT /api/users (requires token)', () => {
    test('rejects update without token', async () => {
      await api.put('/api/users').send({ name: 'No Token' }).expect(401);
    });

    test('updates own user data with valid token', async () => {
      const token = await loginAndGetToken();

      const res = await api
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      assert.strictEqual(res.body.name, 'Updated Name');
    });

    test('updates username with valid token', async () => {
      const token = await loginAndGetToken();

      const res = await api
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'newusername' })
        .expect(200);

      assert.strictEqual(res.body.username, 'newusername');
    });

    test('rejects update with empty body', async () => {
      const token = await loginAndGetToken();

      await api
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });
});
