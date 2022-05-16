const requestIp = require('request-ip');
const requestCountry = require('request-country');
const parser = require('ua-parser-js');

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

const log = (message) => console.log(message)

module.exports = {
  getBrowserInfo,
  getCountry,
  getIP,
  removeExtensionFromFile,
  log,
  parseUserAgent
};
