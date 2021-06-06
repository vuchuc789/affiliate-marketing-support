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
    default: '',
  },
  components: {
    type: String,
    default: '',
  },
  css: {
    type: String,
    default: '',
  },
  html: {
    type: String,
    default: '',
  },
  styles: {
    type: String,
    default: '',
  },
});

module.exports = model('pages', pageSchema);
