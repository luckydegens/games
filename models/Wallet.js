const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  alias: {
    type: String
  },
  tags: {
    type: [String]
  },
  betterChance: {
    type: Boolean,
    required: true,
    default: false
  },
  spinAmount: {
    type: Number,
    default: 10,
    required: true
  }
}, { timestamps: true });

module.exports = WalletSchema;
