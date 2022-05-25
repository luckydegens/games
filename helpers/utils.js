const requestIp = require('request-ip');
const requestCountry = require('request-country');
const parser = require('ua-parser-js');

const jsonParse = (json) => {
  let parsed;
  if (typeof json === 'string') {
    try {
      parsed = JSON.parse(json);
    } catch (e) {
      parsed = {};
    }
  } else {
    parsed = json;
  }
  return parsed;
};

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const isObject = (item) => {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
};

const parseStringToArray = (str = '') => {
  return str.split(',').map(it => it.split('\n'))
    .flat().map(it => it.trim()).filter(it => !!it);
};

const getBrowserInfo = ({ headers }) => headers['user-agent']

const getCountry = (req) =>
  req.headers['cf-ipcountry']
    ? req.headers['cf-ipcountry']
    : requestCountry(req)

const getIP = (req) => requestIp.getClientIp(req)

const removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

const parseUserAgent = (ua) => {
  const device = parser(ua)

  return {
    device: device.device.type || 'desktop',
    browser: device.browser.name,
    os: device.os.name
  }
};

function getRndFloat(min, max) {
  return ((Math.random() * (max - min + 1) ) + min).toFixed(2);
}

module.exports = {
  jsonParse,
  timeout,
  isObject,
  parseStringToArray,
  getBrowserInfo,
  getCountry,
  getIP,
  removeExtensionFromFile,
  parseUserAgent,
  getRndFloat
};
