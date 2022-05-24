const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

async function encode (data) {
  const token = await new Promise((resolve, reject) => {
    jwt.sign(data, secret, {}, function (err, token) {
      if (err) reject(err);

      resolve(token);
    });
  }).catch(() => null);

  return token;
};

async function decode (token) {
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, function (err, token) {
      if (err) reject(err);

      resolve(token);
    });
  }).catch(() => { });

  return decoded;
};

module.exports = { encode, decode };
