'use strict';

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { api, setupDB, loginAndGetToken, notesData } from './test.helper';

setupDB();

describe('Notes API', () => {
  describe('POST /api/notes/note', () => {
    test('create notes without content should fail', async () => {
      const token = await loginAndGetToken();
      const response = await api
        .post('/api/notes/note')
        .set('Authorization', `Bearer ${token}`)
        .send({ importance: true })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.error, "Content can't be empty");
    });
    test('create and return created note', async () => {
      const token = await loginAndGetToken();
      const res = await api
        .post('/api/notes/note')
        .set('Authorization', `Bearer ${token}`)
        .send(notesData)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(Object.keys(res.body).length, 5);
      assert.strictEqual(res.body.content, notesData.content);
      assert.strictEqual(res.body.importance, notesData.importance);
      assert.ok(res.body.date);
      assert.ok(res.body.users);
    });
  });

  describe('GET /api/notes', () => {
    test('get all notes for current user', async () => {
      const token = await loginAndGetToken();
      const res = await api
        .get('/api/notes/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(Array.isArray(res.body), true);
      assert.strictEqual(res.body.length, 1);
    });
  });

  describe('PUT /api/notes/note', () => {
    test('update and return updated note', async () => {
      const token = await loginAndGetToken();
      const getNotes = await api
        .get('/api/notes/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const notesId = getNotes.body.find(
        n => n.content === notesData.content
      ).id;

      const res = await api
        .put('/api/notes/note/' + notesId)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Updated note content',
          importance: false
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
      assert.strictEqual(Object.keys(res.body).length, 6);
      assert.strictEqual(res.body.content, 'Updated note content');
      assert.strictEqual(res.body.importance, false);
    });
  });

  describe('DELETE /api/notes/note', () => {
    test('delete and return deleted note', async () => {
      const token = await loginAndGetToken();
      const getNotes = await api
        .get('/api/notes/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const notesId = getNotes.body.find(
        n => n.content === notesData.content
      ).id;
      const res = await api
        .delete('/api/notes/note/' + notesId)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(res.body.id, notesId);

      // verify it's gone
      const after = await api
        .get('/api/notes/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      assert.strictEqual(after.body.length, 0);
    });
  });
});
