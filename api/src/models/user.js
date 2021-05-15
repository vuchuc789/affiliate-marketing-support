const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema, model } = mongoose;
const salt = 12;

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
  },
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model('users', userSchema);
