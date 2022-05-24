const axios = require('axios');

const addWalletToLaunchpadEvent = async({ wallet, eventId, collectionKey }) => {
  return axios({
    method: 'post',
    url: 'https://cms-cyerpekysq-uc.a.run.app/api/event/wallet',
    data: {
      wallet,
      eventId,
      collectionKey
    }
  }).then(res => {
    return res.data
  }).catch(err => {
    if (err && err.response && err.response.data) {
      console.log(`ADD_WALLET_TO_LAUNCHPAD_EVENT::ERROR: ${JSON.stringify(err.response.data)}`)
    }
  })
};

module.exports = {
  addWalletToLaunchpadEvent
};
