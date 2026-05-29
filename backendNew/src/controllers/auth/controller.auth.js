'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { postData, getDataByFilter } = require('../../core/service');
const User = require('../../models/users');
const { validateAuthRegister, validateAuthLogin } = require('./validate.auth');

const registerUser = async (req, res) => {
  const { body } = req;
  const validationUser = await validateAuthRegister({ data: body });
  let response;
  if (!validationUser.valid) {
    response = res.status(400).json({ error: validationUser.message });
  } else {
    const passwordHash = await bcrypt.hash(body.password, process.env.SALT);
    const user = await postData({
      model: User,
      data: { username: body.username, name: body.name, passwordHash }
    });
    response = res.status(201).json(user);
  }
  return response;
};

const loginUser = async (req, res) => {
  const { body } = req;
  const { username, password } = body;
  const validation = await validateAuthLogin({ username, password });
  let response;
  if (!validation.valid) {
    response = res.status(400).json({ error: validation.message });
  } else {
    const user = await getDataByFilter({
      model: User,
      filter: { username },
      single: true
    });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);
    if (!user || !passwordCorrect) {
      response = res
        .status(401)
        .json({ error: 'Invalid username or password' });
    } else {
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 }
      );
      response = res
        .status(200)
        .json({ token, username: user.username, name: user.name });
    }
  }
  return response;
};

module.exports = { registerUser, loginUser };
