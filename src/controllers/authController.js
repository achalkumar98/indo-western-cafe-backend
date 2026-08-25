const asyncHandler = require("../middleware/asyncHandler");
const authService = require("../services/authService");
const logger = require("../utils/logger");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  logger.info(`Admin registered: ${result.user.username}`);
  res.status(201).json({ success: true, ...result });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  logger.info(`Admin login: ${result.user.username}`);
  res.json({ success: true, ...result });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.admin });
});

module.exports = { register, login, me };
