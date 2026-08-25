const asyncHandler = require("../middleware/asyncHandler");
const bannerService = require("../services/bannerService");
const logger = require("../utils/logger");

// GET /api/banners/active (public)
const getActive = asyncHandler(async (req, res) => {
  const banner = await bannerService.getActive();
  res.json({ success: true, data: banner || null });
});

// GET /api/admin/banners (admin)
const listAll = asyncHandler(async (req, res) => {
  const data = await bannerService.listAll();
  res.json({ success: true, count: data.length, data });
});

// POST /api/admin/banners (admin)
const create = asyncHandler(async (req, res) => {
  const banner = await bannerService.create(req.body);
  logger.info(`Banner created: ${banner.title}`);
  res.status(201).json({ success: true, message: "Banner created", data: banner });
});

// PUT /api/admin/banners/:id (admin)
const update = asyncHandler(async (req, res) => {
  const banner = await bannerService.update(req.params.id, req.body);
  res.json({ success: true, message: "Banner updated", data: banner });
});

// DELETE /api/admin/banners/:id (admin)
const remove = asyncHandler(async (req, res) => {
  await bannerService.remove(req.params.id);
  res.json({ success: true, message: "Banner deleted" });
});

module.exports = { getActive, listAll, create, update, remove };
