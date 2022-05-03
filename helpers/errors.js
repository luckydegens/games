const DEFAULT_ERROR_CODE = 500;

class BaseError extends Error {
  constructor(statusCode, message) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this);
  };
}

class APIError extends BaseError {
  constructor(statusCode = DEFAULT_ERROR_CODE, message) {
    super(statusCode, message);
  }
}

module.exports = {
  APIError
}
