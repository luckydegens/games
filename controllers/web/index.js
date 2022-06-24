const Web3 = require('web3');

const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const WebGameResult = mongoose.model('WebGameResult');

const { APIError } = require('../../helpers/errors');

const games = {
  wheel: {
    wheel1: require('./wheel/wheel1')
  }
};

const playWebGame = async function(req, res, next) {
  try {
    const { game, gameVersion, walletId } = req.params;

    if (!Object.keys(games).includes(game)) {
      throw new APIError(400, `Game doesn't exist`);
    }

		if (!Object.keys(games[game]).includes(gameVersion)) {
      throw new APIError(400, `Game Version doesn't exist`);
    }

    req.game = game;
    req.gameVersion = gameVersion;

    if (req.wallet) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      req.previousGames = await WebGameResult.find({
        game,
        gameVersion,
        walletId: req.wallet._id,
        createdAt: {
          $gte: startOfToday
        }
      });

      const maxGamesPerDay = req.wallet.spinAmount;

      if (req.previousGames.length >= maxGamesPerDay) {
        return res.status(200).json({
          success: true,
          data: {
            message: `You already played ${maxGamesPerDay} time today, try again tomorrow!`,
            availableAttempts: 0
          }
        });
      }
    }

    await games[game][gameVersion](req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  playWebGame
};
