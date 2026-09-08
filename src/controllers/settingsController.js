const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const settingsService = require('../services/settingsService');

function serialise(settings) {
  const obj = settings.toObject({ virtuals: false });
  if (obj.popularTimes instanceof Map) {
    obj.popularTimes = Object.fromEntries(obj.popularTimes);
  } else if (settings.popularTimes instanceof Map) {
    obj.popularTimes = Object.fromEntries(settings.popularTimes);
  }
  return obj;
}

const getSettings = catchAsync(async (req, res) => {
  const data = await settingsService.getSettings();
  res.status(httpStatus.OK).json({ success: true, data: serialise(data) });
});

const updateSettings = catchAsync(async (req, res) => {
  const data = await settingsService.updateSettings(req.body);
  res.status(httpStatus.OK).json({ success: true, message: 'Settings updated', data: serialise(data) });
});

module.exports = { getSettings, updateSettings };
