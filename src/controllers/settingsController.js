const asyncHandler = require("../middleware/asyncHandler");
const settingsService = require("../services/settingsService");

// Mongoose Map serialises to an object fine in JSON, but explicitly convert
// so the frontend always gets a plain { Mon: [...], Tue: [...] } shape.
function serialise(settings) {
  const obj = settings.toObject({ virtuals: false });
  if (obj.popularTimes instanceof Map) {
    obj.popularTimes = Object.fromEntries(obj.popularTimes);
  } else if (settings.popularTimes instanceof Map) {
    obj.popularTimes = Object.fromEntries(settings.popularTimes);
  }
  return obj;
}

// GET /api/settings (public)
const getSettings = asyncHandler(async (req, res) => {
  const data = await settingsService.getSettings();
  res.json({ success: true, data: serialise(data) });
});

// PATCH /api/admin/settings (admin)
const updateSettings = asyncHandler(async (req, res) => {
  const data = await settingsService.updateSettings(req.body);
  res.json({ success: true, message: "Settings updated", data: serialise(data) });
});

module.exports = { getSettings, updateSettings };
