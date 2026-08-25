const asyncHandler = require("../middleware/asyncHandler");
const adminUserService = require("../services/adminUserService");
const logger = require("../utils/logger");

// GET /api/admin/users
const listAdmins = asyncHandler(async (req, res) => {
  const data = await adminUserService.listAdmins();
  res.json({ success: true, count: data.length, data });
});

// DELETE /api/admin/users/:id
const removeAdmin = asyncHandler(async (req, res) => {
  const deleted = await adminUserService.removeAdmin(req.params.id, req.admin.username);
  logger.info(`Admin deleted: ${deleted.username} by ${req.admin.username}`);
  res.json({ success: true, message: `Admin ${deleted.username} deleted` });
});

module.exports = { listAdmins, removeAdmin };
