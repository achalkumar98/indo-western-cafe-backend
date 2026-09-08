const ApiError = require('../utils/ApiError');
const { GalleryItem } = require('../models');

const listPublic = () => GalleryItem.find({ visible: true }).sort({ sortOrder: 1, createdAt: 1 });

const listAll = () => GalleryItem.find().sort({ sortOrder: 1, createdAt: 1 });

const create = (payload) => GalleryItem.create(payload);

const update = async (id, payload) => {
  const item = await GalleryItem.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) {
    throw new ApiError(404, 'Gallery item not found');
  }
  return item;
};

const remove = async (id) => {
  const item = await GalleryItem.findByIdAndDelete(id);
  if (!item) {
    throw new ApiError(404, 'Gallery item not found');
  }
  return item;
};

module.exports = { listPublic, listAll, create, update, remove };
