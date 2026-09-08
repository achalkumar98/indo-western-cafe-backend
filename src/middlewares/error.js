const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? error.statusCode
      : error instanceof mongoose.Error
        ? 400
        : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    error: err.stack,
    userId: req.user && req.user.id,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  if (config.env === "production" && !err.isOperational) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};

module.exports = { errorConverter, errorHandler };
