const moment = require('moment');

const mongoose = require('mongoose');
const GameResult = mongoose.model('GameResult');

const { APIError } = require('../helpers/errors');

const MAX_GAMES_PER_DAY = 10;

const getRandomFaces = (faces) => {
  const result = [];

  while (result.length < 3) {
    const randomIndex = Math.floor(Math.random() * faces.length);

    const validResult = [...result, faces[randomIndex]];

    if (validResult.length !== 3 || !validResult.every((val, i, arr) => val === arr[0])) {
      result.push(faces[randomIndex]);
    }
  }
  
  return result;
};

const getSlotMachineResult = async (req, res, next) => {
  try {
    const { walletId } = req.body;

    if (!walletId) {
      return res.status(200).json({
        success: false,
        error: "Not wallet ID was provided"
      })
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const previousGames = await GameResult.find({
      gameName: 'slot1',
      walletId,
      createdAt: {
        $gte: startOfToday
      }
    });

    if (previousGames.length >= MAX_GAMES_PER_DAY) {
      return res.status(200).json({
        success: true,
        data: {
          message: `You already played ${MAX_GAMES_PER_DAY} time,try again tomorrow!`,
          availableAttempts: 0
        }
      });
    }

    const chances = {
      panda: 100,
      og: 10000,
      bull: 0,
      ape: 0,
      whale: 0,
      frog: 0
    };

    let winFaces;

    for (let face of Object.keys(chances)) {
      const value = Math.floor(Math.random() * chances[face]);

      if (value === 1) {
        winFaces = face;
      }
    };

    let resultFaces = getRandomFaces(Object.keys(chances));

    if (winFaces) {
      resultFaces = new Array(3).fill(winFaces);
    }

    await GameResult.create({
      gameName: 'slot1',
      walletId,
      win: !!winFaces
    });

    res.status(200).json({
      success : true, 
      data: { 
        win: !!winFaces,
        faces: resultFaces,
        availableAttempts: MAX_GAMES_PER_DAY - (previousGames.length + 1),
        message: !!winFaces ? `Congratulation you just win a ${winFaces} NFT` : `Sorry you didn't win this time, try again`
      }
    })
  } catch(err) {
    next(err);
  }
};

module.exports = {
  getSlotMachineResult
};
