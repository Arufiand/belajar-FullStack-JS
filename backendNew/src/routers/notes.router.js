'use strict';

const express = require('express');
const {
  getNotesFromCurrentUser
} = require('../controllers/notes/notes.controller');
const { verifyToken } = require('../helpers/middleware');

const usersRouter = express.Router();

usersRouter.get('/', verifyToken, getNotesFromCurrentUser);

module.exports = usersRouter;
