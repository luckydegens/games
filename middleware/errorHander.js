const { APIError } = require('../helpers/errors');

function errorHandler(err, req, res, next) {
  console.log(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof APIError) {
    const { statusCode, message } = err;
    res.statusCode = statusCode;
    return res.json({ message });
  }

  res.statusCode = 500;
  res.json({ message: 'Internal server error' });
}

module.exports = errorHandler;
