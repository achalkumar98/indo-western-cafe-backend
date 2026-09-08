const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const statsService = require('../services/statsService');

const getSummary = catchAsync(async (req, res) => {
  const data = await statsService.getSummary();
  res.status(httpStatus.OK).json({ success: true, data });
});

const getTrends = catchAsync(async (req, res) => {
  const data = await statsService.getTrends(req.query.months);
  res.status(httpStatus.OK).json({ success: true, data });
});

module.exports = { getSummary, getTrends };
