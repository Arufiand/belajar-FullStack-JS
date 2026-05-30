'use strict';

const express = require('express');
const {
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById
} = require('../controllers/users/users.controller');
const { verifyToken } = require('../helpers/middleware');

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.put('/', verifyToken, updateUser);
usersRouter.delete('/', verifyToken, deleteUser);

module.exports = usersRouter;
