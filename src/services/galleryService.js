const GalleryItem = require("../models/GalleryItem");

const notFound = () => {
  const err = new Error("Gallery item not found");
  err.statusCode = 404;
  return err;
};

// Public: visible items sorted by sortOrder
const listPublic = () =>
  GalleryItem.find({ visible: true }).sort({ sortOrder: 1, createdAt: 1 });

// Admin: all items
const listAll = () => GalleryItem.find().sort({ sortOrder: 1, createdAt: 1 });

const create = (payload) => GalleryItem.create(payload);

const update = async (id, payload) => {
  const item = await GalleryItem.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw notFound();
  }
  return item;
};

const remove = async (id) => {
  const item = await GalleryItem.findByIdAndDelete(id);
  if (!item) {
    throw notFound();
  }
  return item;
};

module.exports = { listPublic, listAll, create, update, remove };
