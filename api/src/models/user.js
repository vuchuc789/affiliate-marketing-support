const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;
const saltRound = 12;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  refreshToken: {
    type: String,
    default: '',
    alias: 'refresh_token',
  },
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      next();
      return;
    }

    this.password = await bcrypt.hash(this.password, saltRound);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model('users', userSchema);
