module.exports = {
  slot1: {
    getMaxGamesPerDay: (vip) => vip ? 20 : 10,
    getChances: (vip) => vip ? ({
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
    })
  },
  slot2: {
    getMaxGamesPerDay: (vip) => vip ? 10 : 5,
    getChances: (vip) => vip ? ({
      test1: 0,
      test2: 10000,
      test3: 1000
    }) : ({
      test1: 0,
      test2: 10000,
      test3: 1000
    })
  }
};
