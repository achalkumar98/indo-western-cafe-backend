const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const adminUserService = require('../services/adminUserService');
const logger = require('../config/logger');

const listAdmins = catchAsync(async (req, res) => {
  const data = await adminUserService.listAdmins();
  res.status(httpStatus.OK).json({ success: true, count: data.length, data });
});

const removeAdmin = catchAsync(async (req, res) => {
  const deleted = await adminUserService.removeAdmin(req.params.id, req.admin.username);
  logger.info(`Admin deleted: ${deleted.username} by ${req.admin.username}`);
  res.status(httpStatus.OK).json({ success: true, message: `Admin ${deleted.username} deleted` });
});

module.exports = { listAdmins, removeAdmin };
