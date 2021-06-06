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
    alias: 'adpia_id',
    default: '',
  },
  couponApi: {
    type: String,
    alias: 'coupon_api',
    default: '',
  },
});

module.exports = model('adpia_infos', adpiaInfoSchema);
