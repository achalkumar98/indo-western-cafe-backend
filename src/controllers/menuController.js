const asyncHandler = require("../middleware/asyncHandler");
const menuService = require("../services/menuService");
const logger = require("../utils/logger");

// GET /api/menu (public) — grouped by category
const listPublic = asyncHandler(async (req, res) => {
  const data = await menuService.listPublic();
  res.json({ success: true, data });
});

// GET /api/admin/menu (admin) — flat list
const listAll = asyncHandler(async (req, res) => {
  const data = await menuService.listAll(req.query);
  res.json({ success: true, count: data.length, data });
});

// POST /api/admin/menu (admin)
const create = asyncHandler(async (req, res) => {
  const item = await menuService.create(req.body);
  logger.info(`Menu item created: ${item.name}`);
  res.status(201).json({ success: true, message: "Menu item created", data: item });
});

// PUT /api/admin/menu/:id (admin)
const update = asyncHandler(async (req, res) => {
  const item = await menuService.update(req.params.id, req.body);
  res.json({ success: true, message: "Menu item updated", data: item });
});

// DELETE /api/admin/menu/:id (admin)
const remove = asyncHandler(async (req, res) => {
  await menuService.remove(req.params.id);
  res.json({ success: true, message: "Menu item deleted" });
});

module.exports = { listPublic, listAll, create, update, remove };
