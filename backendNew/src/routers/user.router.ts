import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById
} from '../controllers/users/users.controller';
import { verifyToken } from '../helpers/middleware';

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.put('/', verifyToken, updateUser);
usersRouter.delete('/', verifyToken, deleteUser);

export default usersRouter;
