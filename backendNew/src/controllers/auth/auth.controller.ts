'use strict';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { postData } from '../../core/mongoQueryHelper';
import User from '../../models/users';
import { validateAuthRegister, validateAuthLogin } from './auth.validate';

const registerUser = async (req, res) => {
  const { body } = req;
  const validationUser = await validateAuthRegister({ data: body });
  let response;
  if (!validationUser.valid) {
    response = res.status(400).json({ error: validationUser.message });
  } else {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
    const passwordHash = await bcrypt.hash(body.password, salt);
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
    const { user } = validation;
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
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

exports = { registerUser, loginUser };
