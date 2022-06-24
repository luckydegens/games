const { APIError } = require('../../helpers/errors');

const { getPreviousGames } = require('../../helpers/games');
const { pushSlotDataToAirtable } = require('../../helpers/airtable');

const games = {
  casino1: {
    slots: {
      slot1: require('./casino1/slots/slot1'),
      slot2: require('./casino1/slots/slot2'),
      slot3: require('./casino1/slots/slot3')
    }
  },
  casino2: {
    slots: {
      slot1: require('./casino2/slots/slot1'),
    }
  }
};

const playCasinoGame = async function(req, res, next) {
  try {
    const { casino, game, gameVersion } = req.params;

    if (!Object.keys(games).includes(casino)) {
      throw new APIError(400, 'Casino not exist');
    }

		if (!Object.keys(games[casino]).includes(game)) {
      throw new APIError(400, `Game doesn't exist`);
    }

		if (!Object.keys(games[casino][game]).includes(gameVersion)) {
      throw new APIError(400, `Game Version doesn't exist`);
    }

    req.casino = casino;
    req.game = game;
    req.gameVersion = gameVersion;

		req.previousGames = await getPreviousGames(req.wallet, req.casino, req.game, req.gameVersion);
    const maxGamesPerDay = req.wallet.spinAmount;

    if (req.previousGames.length >= maxGamesPerDay) {
      const response = {
        success: true,
        data: {
          message: `You already played ${maxGamesPerDay} time today, try again tomorrow!`,
          availableAttempts: 0
        }
      };

      await pushSlotDataToAirtable(req, {
        walletId: req.wallet.id,
        response
      });

      return res.status(200).json(response);
    }

    await games[casino][game][gameVersion](req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  playCasinoGame
};
