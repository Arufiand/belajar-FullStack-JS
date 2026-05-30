'use strict';

const User = require('../../models/users');
const { getOneDataByFilter } = require('../../core/mongoQueryHelper');

async function validateUserUpdate({ data, id }) {
  let valid = true;
  let message = '';

  if (!data || Object.keys(data).length === 0) {
    valid = false;
    message = 'No fields provided to update';
  } else if (data.username) {
    const existing = await getOneDataByFilter({
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

module.exports = { validateUserUpdate };
