const keystone = require('keystone');
const Types = keystone.Field.Types;

const Wallet = new keystone.List('Wallet', {
  track: true,
  defaultSort: '-createdAt',
});

Wallet.add({
  name: { type: Types.Text, unique: true, required: true, initial: true },
  alias: { type: Types.Text, initial: true },
  tags: { type: Types.TextArray },
  betterChance: { type: Types.Boolean, default: false, initial: true },
  spinAmount: { type: Types.Number, default: 10, required: true, initial: true },
  // moreSpin: { type: Types.Boolean, default: false, required: true, initial: true }
});

Wallet.defaultColumns = 'name, betterChance, spinAmount';
Wallet.register();
