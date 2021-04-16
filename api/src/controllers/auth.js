const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const usernameRegex = /^(?!_+)[a-zA-Z0-9_]{4,20}(?<!_+)$/;
const passwordRegex = /^.{6,20}$/;
const salt = 12;
const jwtSecret = process.env.JWT_KEY;
const tokenAge = 60 * 60;

const User = require('../models/user');

// create new user, return tokens
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Missing username or password' });
      return;
    }

    if (!usernameRegex.test(username)) {
      res.status(400).json({ error: 'Invalid username' });
      return;
    }

    if (!passwordRegex.test(password)) {
      res.status(400).json({ error: 'Invalid password' });
      return;
    }

    if (await User.exists({ username })) {
      res.status(400).json({ error: 'Username is existed' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
    });

    const savedDoc = await user.save();

    res.json({ id: savedDoc._id, username: savedDoc.username });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// get tokens by password
const login = async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Missing username or password' });
    return;
  }

  const doc = await User.findOne({ username });

  if (!doc) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (!bcrypt.compare(password, doc.password)) {
    res.status(400).json({ error: 'Wrong password' });
    return;
  }

  const token = jwt.sign({ id: doc._id }, jwtSecret, {
    expiresIn: tokenAge,
  });

  res.json({ id: doc._id, token });
};

module.exports = {
  register,
  login,
};
