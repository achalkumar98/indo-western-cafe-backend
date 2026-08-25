const asyncHandler = require("../middleware/asyncHandler");
const settingsService = require("../services/settingsService");

// GET /api/settings (public) — phone, address, hours, etc.
const getSettings = asyncHandler(async (req, res) => {
  const data = await settingsService.getSettings();
  res.json({ success: true, data });
});

// PATCH /api/admin/settings (admin) — partial update
const updateSettings = asyncHandler(async (req, res) => {
  const data = await settingsService.updateSettings(req.body);
  res.json({ success: true, message: "Settings updated", data });
});

module.exports = { getSettings, updateSettings };
