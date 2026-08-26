const Settings = require("../models/Settings");

/**
 * Returns the singleton settings document, creating it with defaults if it
 * doesn't exist yet.
 */
const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

/**
 * Partial update — only the fields supplied are changed.
 * popularTimes is merged at the key level (not replaced wholesale unless
 * all 7 days are supplied).
 */
const updateSettings = async (payload) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(payload);
    return settings;
  }

  // Handle Map field (popularTimes) manually so partial day updates work
  if (payload.popularTimes) {
    for (const [day, slots] of Object.entries(payload.popularTimes)) {
      settings.popularTimes.set(day, slots);
    }
    delete payload.popularTimes;
    settings.markModified("popularTimes");
  }

  Object.assign(settings, payload);
  await settings.save();
  return settings;
};

module.exports = { getSettings, updateSettings };
