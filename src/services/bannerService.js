const ApiError = require('../utils/ApiError');
const { Banner } = require('../models');

const getActive = () => Banner.findOne({ isActive: true }).sort({ updatedAt: -1 });

const listAll = () => Banner.find().sort({ createdAt: -1 });

const create = (payload) => Banner.create(payload);

const update = async (id, payload) => {
  const banner = await Banner.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!banner) {
    throw new ApiError(404, 'Banner not found');
  }
  return banner;
};

const remove = async (id) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) {
    throw new ApiError(404, 'Banner not found');
  }
  return banner;
};

module.exports = { getActive, listAll, create, update, remove };
