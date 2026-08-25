const asyncHandler = require("../middleware/asyncHandler");
const statsService = require("../services/statsService");

// GET /api/admin/stats/summary
const getSummary = asyncHandler(async (req, res) => {
  const data = await statsService.getSummary();
  res.json({ success: true, data });
});

// GET /api/admin/stats/trends?months=6
const getTrends = asyncHandler(async (req, res) => {
  const data = await statsService.getTrends(req.query.months);
  res.json({ success: true, data });
});

module.exports = { getSummary, getTrends };
