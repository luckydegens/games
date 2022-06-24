const mongoose = require('mongoose');
const WebGameResult = mongoose.model('WebGameResult');

const { getFacesByChances } = require('../../../helpers/faces');

const chances = {
  nft: 100,
  usdt: 100,
  whitelist: 5
};

module.exports = async (req, res, next) => {
  try {
    const { winFaces } = getFacesByChances(chances);

    if (req.wallet) {
      await WebGameResult.create({
        game: req.game,
        gameVersion: req.gameVersion,
        walletId: req.wallet,
        win: !!winFaces
      });
    }

    let message = `Sorry you didn't win this time, try again`

    if (winFaces) {
      message = `Congratulation! you just won a ${winFaces}.`
    }

    res.status(200).json({
      success : true,
      data: {
        win: !!winFaces,
        prize: winFaces || null,
        availableAttempts: req.wallet ? req.wallet.spinAmount - (req.previousGames.length + 1) : undefined,
        message
      }
    });
  } catch(err) {
    next(err);
  }
};
