'use strict';

const express = require('express');
const {
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById
} = require('../controllers/users/controller.users');

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);

module.exports = usersRouter;
