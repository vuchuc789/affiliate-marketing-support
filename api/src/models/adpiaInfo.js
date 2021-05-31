const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const adpiaInfoSchema = new Schema({
  userId: {
    type: String,
    required: true,
    alias: 'user_id',
  },
  adpiaId: {
    type: String,
    required: true,
    alias: 'adpia_id',
  },
});

module.exports = model('adpia_infos', adpiaInfoSchema);
