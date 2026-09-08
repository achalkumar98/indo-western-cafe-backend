const catchAsync = require('../utils/catchAsync');
const galleryService = require('../services/galleryService');
const logger = require('../config/logger');

const listPublic = catchAsync(async (req, res) => {
  const data = await galleryService.listPublic();
  res.status(200).json({ success: true, count: data.length, data });
});

const listAll = catchAsync(async (req, res) => {
  const data = await galleryService.listAll();
  res.status(200).json({ success: true, count: data.length, data });
});

const create = catchAsync(async (req, res) => {
  const item = await galleryService.create(req.body);
  logger.info(`Gallery item created: ${item.label || item.imageUrl}`);
  res.status(201).json({ success: true, message: 'Gallery item created', data: item });
});

const update = catchAsync(async (req, res) => {
  const item = await galleryService.update(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Gallery item updated', data: item });
});

const remove = catchAsync(async (req, res) => {
  await galleryService.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Gallery item deleted' });
});

module.exports = { listPublic, listAll, create, update, remove };
