const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ObjectId } = mongoose.Schema.Types

const WebGameResultSchema = new Schema({
  game: {
    type: String,
    required: true
  },
  gameVersion: {
    type: String,
    required: true
  },
  walletId: {
    type: ObjectId,
    ref: 'Wallet',
    required: true
  },
  win: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = WebGameResultSchema;
