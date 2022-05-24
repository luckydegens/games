const Web3 = require('web3');
const keystone = require('keystone');
const apiHelper = require('../../helpers/api');

const Wallet = keystone.list('Wallet');

const retrieveWallet = async (req, res, next) => {
  try {
    const { walletId } = req.body;

    if (!walletId || !Web3.utils.isAddress(walletId)) {
      return res.status(200).json({
        success: false,
        error: "Not wallet ID was provided",
        data: {
          message: `You need to connect your wallet to play`
        }
      })
    }

    let wallet = await Wallet.model.findOne({
      name: walletId
    }).exec();

    if (!wallet) {
      const newWallet = new Wallet.model({
        name: walletId,
        betterChance: false,
        moreSpin: false
      });
  
      wallet = await newWallet.save();
    }

    req.wallet = wallet;

    next();
  } catch (err) {
    return apiHelper.apiError(req, res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = {
  retrieveWallet
};
