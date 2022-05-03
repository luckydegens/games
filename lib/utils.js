const requestIp = require('request-ip');
const requestCountry = require('request-country');

const getBrowserInfo = ({ headers }) => headers['user-agent']

const getCountry = (req) =>
  req.headers['cf-ipcountry']
    ? req.headers['cf-ipcountry']
    : requestCountry(req)

const getIP = (req) => requestIp.getClientIp(req)

const removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

const log = (message) => console.log(message)

module.exports = {
  getBrowserInfo,
  getCountry,
  getIP,
  removeExtensionFromFile,
  log
}
