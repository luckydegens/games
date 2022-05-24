const apiResponse = (req, res, body = {}) => {
  return res.apiResponse(body);
};

const apiError = (req, res, code, status) => {
  return res.status(status || 500).apiResponse({
    module: 'MAIN',
    code: code,
    message: code,
  });
};

module.exports = {
  apiError,
  apiResponse,
};
