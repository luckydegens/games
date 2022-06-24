const mongoose = require('mongoose');
const GameResult = mongoose.model('GameResult');

const getPreviousGames = async (wallet, casino, game, gameVersion) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const previousGames = await GameResult.find({
    casino,
    game,
    walletId: wallet._id,
    createdAt: {
      $gte: startOfToday
    }
  });
  
  return previousGames;
};

module.exports = {
  getPreviousGames
};
