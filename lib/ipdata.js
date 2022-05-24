const IPData = require('ipdata').default;

async function ipdata(ip) {
  const ipdata = new IPData(process.env.IPDATA_API_KEY);

  const data = await ipdata.lookup(ip).catch(() => null)

  return data;
}

module.exports = ipdata;
