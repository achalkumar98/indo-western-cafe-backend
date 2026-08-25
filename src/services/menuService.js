const MenuItem = require("../models/MenuItem");

const notFound = () => {
  const err = new Error("Menu item not found");
  err.statusCode = 404;
  return err;
};

// Public: all available items grouped by category.
const listPublic = async () => {
  const items = await MenuItem.find({ available: true }).sort({ category: 1, sortOrder: 1, createdAt: 1 });
  // Group into { category, items[] } shape for the frontend
  const groups = [];
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.category)) {
      const g = { category: item.category, items: [] };
      map.set(item.category, g);
      groups.push(g);
    }
    map.get(item.category).items.push(item);
  }
  return groups;
};

// Admin: all items flat with optional category filter.
const listAll = async ({ category } = {}) => {
  const query = category ? { category } : {};
  return MenuItem.find(query).sort({ category: 1, sortOrder: 1, createdAt: 1 });
};

const create = (payload) => MenuItem.create(payload);

const update = async (id, payload) => {
  const item = await MenuItem.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) {throw notFound();}
  return item;
};

const remove = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id);
  if (!item) {throw notFound();}
  return item;
};

module.exports = { listPublic, listAll, create, update, remove };
