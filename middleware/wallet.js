const Web3 = require('web3');

const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');

const retrieveWallet = async (req, res, next) => {
  try {
    const { walletId } = req.body;

    if ((!walletId || !Web3.utils.isAddress(walletId)) && req.requiredWallet) {
      return res.status(200).json({
        success: false,
        error: "Not wallet ID was provided",
        data: {
          message: `You need to connect your wallet to play`
        }
      })
    }

    if (walletId) {
      let wallet = await Wallet.findOne({
        name: walletId
      }).exec();
  
      if (!wallet) {
        wallet = await Wallet.create({
          name: walletId,
          betterChance: false,
          moreSpin: false
        });
      }
  
      req.wallet = wallet;
    }

    next();
  } catch(err) {
    next(err);
  }
};

const requiredWallet = async (req, res, next) => {
  try {
    req.requiredWallet = true;

    next();
  } catch(err) {
    next(err);
  }
};

module.exports = {
  requiredWallet,
  retrieveWallet
};
