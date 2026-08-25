const Banner = require("../models/Banner");

const notFound = () => {
  const err = new Error("Banner not found");
  err.statusCode = 404;
  return err;
};

// Public: the currently active banner (latest one with isActive = true).
const getActive = () => Banner.findOne({ isActive: true }).sort({ updatedAt: -1 });

// Admin: all banners.
const listAll = () => Banner.find().sort({ createdAt: -1 });

const create = (payload) => Banner.create(payload);

const update = async (id, payload) => {
  const banner = await Banner.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!banner) {throw notFound();}
  return banner;
};

const remove = async (id) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) {throw notFound();}
  return banner;
};

module.exports = { getActive, listAll, create, update, remove };
