'use strict';

const User = require('../models/users');
const { getDataByFilter } = require('../core/service');

async function validateUserRegister({ data }) {
  const { username, password, name } = data;

  let valid = true;
  let message = '';

  if (!username) {
    valid = false;
    message = 'Username is required';
  } else if (!password) {
    valid = false;
    message = 'Password is required';
  } else if (!name) {
    valid = false;
    message = 'Name is required';
  } else {
    const existing = await getDataByFilter({
      model: User,
      filter: { username },
      single: true
    });
    if (existing) {
      valid = false;
      message = 'Username already exists';
    }
  }

  return { valid, message };
}

async function validateUserUpdate({ data, id }) {
  let valid = true;
  let message = '';

  if (!data || Object.keys(data).length === 0) {
    valid = false;
    message = 'No fields provided to update';
  } else if (data.username) {
    const existing = await getDataByFilter({
      model: User,
      filter: { username: data.username },
      single: true
    });
    if (existing && existing._id.toString() !== id) {
      valid = false;
      message = 'Username already taken';
    }
  }

  return { valid, message };
}

module.exports = { validateUserRegister, validateUserUpdate };
