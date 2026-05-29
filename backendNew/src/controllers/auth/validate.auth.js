const { getOneDataByFilter } = require('../../core/service');
const User = require('../../models/users');

async function validateAuthRegister({ data }) {
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
    const existing = await getOneDataByFilter({
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

async function validateAuthLogin({ username, password }) {
  let valid = true;
  let message = '';
  let user = null;

  if (!username) {
    valid = false;
    message = 'Username is required';
  } else if (!password) {
    valid = false;
    message = 'Password is required';
  } else {
    user = await getOneDataByFilter({
      model: User,
      filter: { username },
      single: true
    });
    if (!user) {
      valid = false;
      message = 'Username not found';
    }
  }

  return { valid, message, user };
}

module.exports = { validateAuthRegister, validateAuthLogin };
