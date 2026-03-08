const { test, after, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');

const api = supertest(app);
describe('note_api_test', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('specific note is within the returned notes', async () => {
    const respose = await api.get('/api/notes/');
    const content = respose.body.map(note => note.content);
    assert.strictEqual(content.includes('HTML is easy'), true);
  });
});

after(async () => {
  await mongoose.connection.close();
});
