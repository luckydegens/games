const airtable = require('../lib/airtable');
const activityAirtable = airtable('app0EcfjD3KNKygVG', 'activity');

const { getBrowserInfo, getIP, parseUserAgent } = require('./utils');
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

module.exports = {
  pushDataToAirtable,
  pushSlotDataToAirtable
};
