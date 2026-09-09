const { Settings } = require('../models');

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

const updateSettings = async (payload) => {
  let settings = await Settings.findOne();
  if (!settings) return Settings.create(payload);

  if (payload.popularTimes) {
    if (!settings.popularTimes) {
      settings.popularTimes = new Map();
    }
    for (const [day, slots] of Object.entries(payload.popularTimes)) {
      settings.popularTimes.set(day, slots);
    }
    delete payload.popularTimes;
    settings.markModified('popularTimes');
  }

  Object.assign(settings, payload);
  await settings.save();
  return settings;
};

module.exports = { getSettings, updateSettings };
