const mongoose = require('mongoose');
const GameResult = mongoose.model('GameResult');

const { getFacesByChances } = require('../../../../helpers/slot');
const { addWalletToLaunchpadEvent } = require('../../../../helpers/launchpad');
const { pushSlotDataToAirtable } = require('../../../../helpers/airtable');

const { getRndFloat } = require('../../../../lib/utils');

const getChances = (vip) => vip ? ({
  panda: 0,
  og: 10000,
  bull: 1000,
  ape: 0,
  whale: 0,
  frog: 0
}) : ({
  panda: 0,
  og: 10000,
  bull: 1000,
  ape: 0,
  whale: 0,
  frog: 0
});

module.exports = async (req, res, next) => {
  try {
    const chances = getChances(req.wallet.betterChance);
    const { resultFaces, winFaces } = getFacesByChances(chances);

    await GameResult.create({
      casino: req.casino,
      game: req.game,
      gameVersion: req.gameVersion,
      walletId: req.wallet,
      coordinates: JSON.stringify(req.body.coordinates || {}),
      win: !!winFaces
    });

    let message = `Sorry you didn't win this time, try again`

    if (winFaces == "ape") {
      const winAmount = getRndFloat(5, 10);

      message = `Congratulation! you just won ${winAmount}. Post on discord to claim it`;
    } else if (winFaces){
      message = `Congratulation! you just won a Lucky ${winFaces} NFT. We whitelisted your wallet address for the next mint. For any question, go to our discord.`
    }

    const response = {
      success : true,
      data: {
        win: !!winFaces,
        faces: resultFaces,
        availableAttempts: req.wallet.spinAmount - (req.previousGames.length + 1),
        message
      }
    };

    await pushSlotDataToAirtable(req, {
      walletId: req.wallet.id,
      response, winFaces, req
    });

    if (winFaces && winFaces === 'og') {
      // Need setup correct colectionKey & eventId
      await addWalletToLaunchpadEvent({
        wallet: walletId,
        collectionKey: 'og',
        eventId: 'cl3a1hym2115773s605e6xtg3'
      });
    }

    res.status(200).json(response);
  } catch(err) {
    next(err);
  }
};
