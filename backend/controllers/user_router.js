'use strict';
const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');

userRouter.post('/signup', async (req, res) => {
  const { username, password, name } = req.body;
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, passwordHash, name });
    const savedUser = await user.save();
    res.status(201).json(savedUser.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
