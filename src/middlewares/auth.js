const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized — admin sign-in required');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.admin = { username: decoded.username, role: decoded.role };
    next();
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired or invalid — please sign in again');
  }
});

module.exports = { protect };
