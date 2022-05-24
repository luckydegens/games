const keystone = require('keystone');
const GameResult = keystone.list('GameResult');

const { getPreviousGames, getFacesByChances } = require('../../../../../helpers/slot');
const { addWalletToLaunchpadEvent } = require('../../../../../helpers/launchpad');
const { pushSlotDataToAirtable } = require('../../../../../helpers/airtable');

const getMaxGamesPerDay = (vip) => vip ? 10 : 5;
const getChances = (vip) => vip ? ({
  test1: 0,
  test2: 10000,
  test3: 1000
}) : ({
  test1: 0,
  test2: 10000,
  test3: 1000
});

module.exports = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const previousGames = await getPreviousGames(req.wallet, 'slot2');
    const maxGamesPerDay = getMaxGamesPerDay(req.wallet.moreSpin);

    if (previousGames.length >= maxGamesPerDay) {
      const response = {
        success: true,
        data: {
          message: `You already played ${maxGamesPerDay} time today, try again tomorrow!`,
          availableAttempts: 0
        }
      };

      await pushSlotDataToAirtable(req, {
        walletId: req.wallet._id,
        body: req.body,
        userId, response
      });

      return res.status(200).json(response);
    }

    const chances = getChances(req.wallet.betterChance);
    const { resultFaces, winFaces } = getFacesByChances(chances);

    await GameResult.model.create({
      gameName: 'slot2',
      wallet: req.wallet,
      win: !!winFaces
    });

    const response = {
      success : true,
      data: {
        win: !!winFaces,
        faces: resultFaces,
        availableAttempts: maxGamesPerDay - (previousGames.length + 1),
        message: !!winFaces ? `Congratulation! you just won a Lucky ${winFaces} NFT. We whitelisted your wallet address for the next mint. For any question, go to our discord.` : `Sorry you didn't win this time, try again`
      }
    };

    await pushSlotDataToAirtable(req, {
      walletId: req.wallet._id,
      body: req.body,
      userId, response, winFaces, req
    });

    res.status(200).json(response);
  } catch(err) {
    next(err);
  }
};
