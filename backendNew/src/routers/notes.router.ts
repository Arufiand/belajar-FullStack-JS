'use strict';

import express from 'express';
import {
  getNotesFromCurrentUser,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notes/notes.controller';
import { verifyToken } from '../helpers/middleware';

const notesRouter = express.Router();

notesRouter.get('/', verifyToken, getNotesFromCurrentUser);
notesRouter.post('/note', verifyToken, createNote);
notesRouter.put('/note/:id', verifyToken, updateNote);
notesRouter.delete('/note/:id', verifyToken, deleteNote);

exports = notesRouter;
