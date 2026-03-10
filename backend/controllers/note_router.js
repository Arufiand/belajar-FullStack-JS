// javascript
'use strict';
const express = require('express');
const notesRouter = express.Router();

const Note = require('../models/notes');
const User = require('../models/users');

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (!note) {
    response.statusMessage = 'note not found';
    return response.status(404).json({ error: 'note not found' }).end();
  }
  response.status(200).json(note);
});

notesRouter.delete('/:id', async (request, response) => {
  const deleted = await Note.findByIdAndDelete(request.params.id);
  if (!deleted) {
    response.statusMessage = 'note not found';
    return response.status(404).json({ error: 'note not found' });
  }
  response.status(204).end();
});

notesRouter.post('/', async (request, response) => {
  const body = request.body;
  const user = await User.findById(body.userId);

  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  if (!body || !body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    importance: body.importance === undefined ? false : body.importance,
    users: user._id
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.status(201).json(savedNote);
});

module.exports = notesRouter;
