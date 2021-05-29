const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const pageSchema = new Schema({
  userId: {
    type: String,
    required: true,
    alias: 'user_id',
  },
  assets: {
    type: String,
  },
  components: {
    type: String,
  },
  css: {
    type: String,
  },
  html: {
    type: String,
  },
  style: {
    type: String,
  },
});

module.exports = model('pages', pageSchema);
