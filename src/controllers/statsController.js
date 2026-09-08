const catchAsync = require('../utils/catchAsync');
const statsService = require('../services/statsService');

const getSummary = catchAsync(async (req, res) => {
  const data = await statsService.getSummary();
  res.status(200).json({ success: true, data });
});

const getTrends = catchAsync(async (req, res) => {
  const data = await statsService.getTrends(req.query.months);
  res.status(200).json({ success: true, data });
});

module.exports = { getSummary, getTrends };
