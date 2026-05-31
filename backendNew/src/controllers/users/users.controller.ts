'use strict';

import bcrypt from 'bcrypt';
import {
  getAllData,
  getDataFromId,
  deleteData,
  updateData
} from '../../core/mongoQueryHelper';
import User from '../../models/users';
import { validateUserUpdate } from './users.validate';

const getAllUsers = async (req, res) => {
  const users = await getAllData({
    model: User,
    populate: { path: 'notes', select: { content: 1, important: 1 } }
  });
  return res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await getDataFromId({ model: User, id });
  let response;
  if (!user) {
    response = res.status(404).json({ error: 'Not Found' });
  } else {
    response = res.status(200).json(user);
  }
  return response;
};

const deleteUser = async (req, res) => {
  const id = req.user.id;
  const user = await deleteData({ model: User, id });
  let response;
  if (!user) {
    response = res.status(404).json({ error: 'Not Found' });
  } else {
    response = res.status(200).json(user);
  }
  return response;
};

const updateUser = async (req, res) => {
  const id = req.user.id;
  const { body } = req;
  const validationUser = await validateUserUpdate({ data: body, id });
  let response;
  if (!validationUser.valid) {
    response = res.status(400).json({ error: validationUser.message });
  } else {
    const updateFields = { ...body };
    if (updateFields.password) {
      const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
      updateFields.passwordHash = await bcrypt.hash(
        updateFields.password,
        salt
      );
      delete updateFields.password;
    }
    const user = await updateData({ model: User, id, data: updateFields });
    if (!user) {
      response = res.status(404).json({ error: 'Not Found' });
    } else {
      response = res.status(200).json(user);
    }
  }
  return response;
};

exports = { getAllUsers, getUserById, deleteUser, updateUser };
