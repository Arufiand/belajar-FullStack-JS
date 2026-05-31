'use strict';

const express = require('express');
const {
  getNotesFromCurrentUser,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/notes/notes.controller');
const { verifyToken } = require('../helpers/middleware');

const notesRouter = express.Router();

notesRouter.get('/', verifyToken, getNotesFromCurrentUser);
notesRouter.post('/note', verifyToken, createNote);
notesRouter.put('/note/:id', verifyToken, updateNote);
notesRouter.delete('/note/:id', verifyToken, deleteNote);

module.exports = notesRouter;
