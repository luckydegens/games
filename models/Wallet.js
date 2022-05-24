const keystone = require('keystone');
const Types = keystone.Field.Types;

const Wallet = new keystone.List('Wallet', {
  track: true,
  defaultSort: '-createdAt',
});

Wallet.add({
  name: { type: Types.Text, unique: true, required: true, initial: true },
  betterChance: { type: Types.Boolean, default: false, required: true, initial: true },
  moreSpin: { type: Types.Boolean, default: false, required: true, initial: true }
});

Wallet.defaultColumns = 'name, betterChance, moreSpin';
Wallet.register();
