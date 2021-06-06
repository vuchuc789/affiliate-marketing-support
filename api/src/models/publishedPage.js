const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const publishedPageSchema = new Schema({
  userId: {
    type: String,
    required: true,
    alias: 'user_id',
  },
  css: {
    type: String,
    default: '',
  },
  html: {
    type: String,
    default: '',
  },
});

module.exports = model('published_pages', publishedPageSchema);
