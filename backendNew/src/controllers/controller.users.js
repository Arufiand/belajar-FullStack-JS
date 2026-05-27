'use strict';

const {
  getAllData,
  getDataFromId,
  deleteData,
  updateData,
  postData
} = require('../core/service');
const User = require('../models/users');
const {
  validateUserRegister,
  validateUserUpdate
} = require('./validate.users');

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
  const { id } = req.params;
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
  const { id } = req.params;
  const { body } = req;
  const validationUser = await validateUserUpdate({ data: body, id });
  let response;
  if (!validationUser.valid) {
    response = res.status(400).json({ error: validationUser.message });
  } else {
    const user = await updateData({ model: User, id, data: body });
    if (!user) {
      response = res.status(404).json({ error: 'Not Found' });
    } else {
      response = res.status(200).json(user);
    }
  }
  return response;
};

const postUser = async (req, res) => {
  const { body } = req;
  const validationUser = await validateUserRegister({ data: body });
  let response;
  if (!validationUser.valid) {
    response = res.status(400).json({ error: validationUser.message });
  } else {
    const user = await postData({ model: User, data: body });
    response = res.status(201).json(user);
  }
  return response;
};

module.exports = { getAllUsers, getUserById, deleteUser, updateUser, postUser };
