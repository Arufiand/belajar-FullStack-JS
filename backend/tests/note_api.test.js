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

  const promiseNotes = initialNotes.map(note => new Note(note).save());
  await Promise.all(promiseNotes);
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

    const response = await notesInDb();
    assert.strictEqual(response.length, initialNotes.length);
  });

  test.only('a specific note can be viewed', async () => {
    const notesAtStart = await notesInDb();
    const noteToView = notesAtStart[0];

    /** @type {import('superagent').Request} */
    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(resultNote.body.content, noteToView.content);
  });

  test('a specific note can be deleted', async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0];
    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
    const notesAtEnd = await notesInDb();
    const ids = notesAtEnd.map(note => note.id);
    assert(!ids.includes(noteToDelete.id));
    assert.strictEqual(notesAtEnd.length, initialNotes.length - 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
