const keystone = require('keystone');
const GameResult = keystone.list('GameResult');

const getPreviousGames = async (wallet, gameName) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const previousGames = await GameResult.model.find({
    gameName,
    wallet: wallet._id,
    createdAt: {
      $gte: startOfToday
    }
  });
  
  return previousGames
};

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

const getFacesByChances = (chances) => {
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

  return { winFaces, resultFaces };
}

module.exports = {
  getRandomFaces,
  getPreviousGames,
  getFacesByChances
};
