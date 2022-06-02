const airtable = require('../lib/airtable');
const activityAirtable = airtable('app0EcfjD3KNKygVG', 'activity');

const { getBrowserInfo, getIP, parseUserAgent } = require('../lib/utils');
const ipdata = require('../lib/ipdata');

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
};

const pushSlotDataToAirtable = async (req, { walletId, winFaces = null, response }) => {
  const event = !!winFaces ? 'play slot : win' : 'play slot : lose';
  const notes = !!winFaces ? `play slot : win ${winFaces}` : 'play slot : lose';

  return pushDataToAirtable(req, {
    casino: req.casino,
    game: req.game,
    game_version: req.gameVersion,
    coordinates: JSON.stringify(req.body.coordinates || {}),
    userId: req.body.userId,
    event, notes,
    wallet: `${walletId}`,
    request: JSON.stringify(req.body),
    response: JSON.stringify(response)
  });
};

module.exports = {
  pushDataToAirtable,
  pushSlotDataToAirtable
};
