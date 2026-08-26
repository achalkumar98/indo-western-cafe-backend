const asyncHandler = require("../middleware/asyncHandler");
const galleryService = require("../services/galleryService");
const logger = require("../utils/logger");

// GET /api/gallery (public)
const listPublic = asyncHandler(async (req, res) => {
  const data = await galleryService.listPublic();
  res.json({ success: true, count: data.length, data });
});

// GET /api/admin/gallery (admin)
const listAll = asyncHandler(async (req, res) => {
  const data = await galleryService.listAll();
  res.json({ success: true, count: data.length, data });
});

// POST /api/admin/gallery (admin)
const create = asyncHandler(async (req, res) => {
  const item = await galleryService.create(req.body);
  logger.info(`Gallery item created: ${item.label || item.imageUrl}`);
  res.status(201).json({ success: true, message: "Gallery item created", data: item });
});

// PUT /api/admin/gallery/:id (admin)
const update = asyncHandler(async (req, res) => {
  const item = await galleryService.update(req.params.id, req.body);
  res.json({ success: true, message: "Gallery item updated", data: item });
});

// DELETE /api/admin/gallery/:id (admin)
const remove = asyncHandler(async (req, res) => {
  await galleryService.remove(req.params.id);
  res.json({ success: true, message: "Gallery item deleted" });
});

module.exports = { listPublic, listAll, create, update, remove };
