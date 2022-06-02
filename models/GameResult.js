const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { ObjectId } = mongoose.Schema.Types

const GameResultSchema = new Schema({
  casino: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  gameVersion: {
    type: String,
    required: true
  },
  coordinates: String,
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

module.exports = GameResultSchema;
