const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameResultSchema = new Schema({
  gameName: {
    type: String,
    required: true
  },
  walletId: {
    type: String,
    required: true
  },
  win: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = GameResultSchema;
