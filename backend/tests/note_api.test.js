const { test, before, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
require('dotenv').config();
process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');
const Note = require('../models/notes');
const { initialNotes, notesInDb, nonExistingId } = require('./test_helper');
const { connectIfNeeded } = require('../utils/config');

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

  test('a valid note can be added', async () => {
    const newNote = {
      content: 'React is fun',
      important: true
    };
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    /** @type {import('superagent').Response} */
    const notesAtEnd = await notesInDb();
    assert.strictEqual(notesAtEnd.length, initialNotes.length + 1);

    const contents = notesAtEnd.map(note => note.content);
    assert(contents.includes('React is fun'));
  });

  test.only('a note without content cant be added', async () => {
    const newNote = {
      important: true
    };
    await api.post('/api/notes').send(newNote).expect(400);

    /** @type {import('superagent').Response} */
    const response = await notesInDb();
    assert.strictEqual(response.body.length, initialNotes.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
