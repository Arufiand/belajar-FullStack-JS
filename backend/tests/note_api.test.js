const { test, before, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
require('dotenv').config();
process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');
const Note = require('../models/notes');
const { connectIfNeeded } = require('../utils/config');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
];

const api = supertest(app);

before(async () => {
  await connectIfNeeded();
});
beforeEach(async () => {
  await Note.deleteMany({});
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

/** @type {import('superagent').Response} */
describe('note_api_test', () => {
  test.only('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test.only('specific note is within the returned notes', async () => {
    /** @type {import('superagent').Response} */
    const response = await api.get('/api/notes/');
    const content = response.body.map(note => note.content);
    assert.strictEqual(content.includes('HTML is easy'), true);
  });

  test.only('all note is returned', async () => {
    /** @type {import('superagent').Response} */
    const response = await api.get('/api/notes/');
    assert.strictEqual(response.body.length, initialNotes.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
