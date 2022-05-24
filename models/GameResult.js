const keystone = require('keystone');
const Types = keystone.Field.Types;

const GameResult = new keystone.List('GameResult', {
  track: true,
  defaultSort: '-createdAt',
});

GameResult.add({
  gameName: { type: Types.Text, required: true, initial: true },
  wallet: {  type: Types.Relationship, ref: 'Wallet', required: true, noedit: true, initial: true },
  win: { type: Types.Boolean, default: false, required: true, initial: true }
});

GameResult.defaultColumns = 'gameName, wallet, win';
GameResult.register();
