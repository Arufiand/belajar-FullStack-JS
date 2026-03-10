const User = require('../models/users');
const bcrypt = require('bcrypt');

const initializeUsers = async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const newUser = new User({
    username: 'root',
    passwordHash,
    name: 'Superuser'
  });
  await newUser.save();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

module.exports = { initializeUsers, usersInDb };
