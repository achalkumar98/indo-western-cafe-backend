const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const logger = require('../config/logger');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  logger.info(`Admin registered: ${result.user.username}`);
  res.status(201).json({ success: true, ...result });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  logger.info(`Admin login: ${result.user.username}`);
  res.status(200).json({ success: true, ...result });
});

const me = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, user: req.admin });
});

module.exports = { register, login, me };
