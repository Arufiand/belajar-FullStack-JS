'use strict';
const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');

userRouter.get('/', async (req, res) => {
  const Users = await User.find({}).populate('notes', {
    content: 1,
    important: 1
  });
  res.json(Users);
});

userRouter.post('/signup', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res
      .status(400)
      .json({ error: 'username, password and name required' });
  }
  if (username.length < 3 || password.length < 3)
    return res
      .status(400)
      .json({ error: 'username, password must be at least 3 characters long' });

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ error: 'username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ username, passwordHash, name });
  const savedUser = await user.save();
  res.status(201).json(savedUser.toJSON());
});

module.exports = userRouter;
