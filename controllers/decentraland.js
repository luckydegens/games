const moment = require('moment');

const mongoose = require('mongoose');
const GameResult = mongoose.model('GameResult');

const { APIError } = require('../helpers/errors');
const { getBrowserInfo, getIP, parseUserAgent } = require('../lib/utils');

const airtable = require('../lib/airtable');
const activityAirtable = airtable('app0EcfjD3KNKygVG', 'activity');

const ipdata = require('../lib/ipdata');

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

const pushDataToAirtable = async(req, data) => {
  const ip = getIP(req);
  const ua = getBrowserInfo(req);

  const uaData = parseUserAgent(ua);
  const ipData = (await ipdata(ip)) || {};

  return await activityAirtable.create({
    ...data, ip, ua,
    device: uaData.device,
    browser: uaData.browser,
    os: uaData.os,
    country: ipData.country_name,
    region: ipData.region,
    city: ipData.city
  }).catch(err => {
    console.log(`Airtable Error: ${err.message}`)
  });
}

const pushSlotDataToAirtable = async (req, { walletId, userId = null, winFaces = null, body, response }) => {
  const event = !!winFaces ? 'play slot : win' : 'play slot : lose';
  const notes = !!winFaces ? `play slot : win ${winFaces}` : 'play slot : lose';

  return pushDataToAirtable(req, {
    userId, event, notes,
    wallet: `${walletId}`,
    request: JSON.stringify(body),
    response: JSON.stringify(response)
  });
};

const getSlotMachineResult = async (req, res, next) => {
  try {
    const { walletId, userId } = req.body;

    if (!walletId || walletId == "null") {
      return res.status(200).json({
        success: false,
        error: "Not wallet ID was provided",
        data: {
          message: `You need to connect your wallet to play`
        }
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
      const response = {
        success: true,
        data: {
          message: `You already played ${MAX_GAMES_PER_DAY} time today, try again tomorrow!`,
          availableAttempts: 0
        }
      };

      await pushSlotDataToAirtable(req, {
        walletId, userId, response,
        body: req.body
      });

      return res.status(200).json(response);
    }

    const chances = {
      panda: 0,
      og: 10000,
      bull: 1000,
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

    const response = {
      success : true,
      data: {
        win: !!winFaces,
        faces: resultFaces,
        availableAttempts: MAX_GAMES_PER_DAY - (previousGames.length + 1),
        message: !!winFaces ? `Congratulation! you just won a Lucky ${winFaces} NFT. We whitelisted your wallet address for the next mint. For any question, go to our discord.` : `Sorry you didn't win this time, try again`
      }
    };

    await pushSlotDataToAirtable(req, {
      walletId, userId, response, winFaces, req,
      body: req.body
    });

    res.status(200).json(response);
  } catch(err) {
    next(err);
  }
};

const saveAnalytics = async (req, res, next) => {
  try {
    const { userId, walletId, event } = req.body;

    if (!userId) {
      throw new APIError(400, 'UserId is required');
    }

    if (!event) {
      throw new APIError(400, 'Event is required');
    }

    const response = { success: true };

    await pushDataToAirtable(req, {
      userId, event,
      wallet: `${walletId}`,
      request: JSON.stringify(req.body),
      response: JSON.stringify(response)
    });

    res.status(200).json(response);
  } catch(err) {
    next(err);
  }
};

module.exports = {
  getSlotMachineResult,
  saveAnalytics
};
