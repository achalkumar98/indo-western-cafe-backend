const Settings = require("../models/Settings");

/**
 * Returns the singleton settings document, creating it with defaults if it
 * doesn't exist yet (upsert pattern).
 */
const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {settings = await Settings.create({});}
  return settings;
};

/**
 * Partial update — only the fields supplied are changed.
 */
const updateSettings = async (payload) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(payload);
    return settings;
  }
  Object.assign(settings, payload);
  await settings.save();
  return settings;
};

module.exports = { getSettings, updateSettings };
