const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const menuService = require('../services/menuService');
const logger = require('../config/logger');

const listPublic = catchAsync(async (req, res) => {
  const data = await menuService.listPublic();
  res.status(httpStatus.OK).json({ success: true, data });
});

const listAll = catchAsync(async (req, res) => {
  const data = await menuService.listAll(req.query);
  res.status(httpStatus.OK).json({ success: true, count: data.length, data });
});

const create = catchAsync(async (req, res) => {
  const item = await menuService.create(req.body);
  logger.info(`Menu item created: ${item.name}`);
  res.status(httpStatus.CREATED).json({ success: true, message: 'Menu item created', data: item });
});

const update = catchAsync(async (req, res) => {
  const item = await menuService.update(req.params.id, req.body);
  res.status(httpStatus.OK).json({ success: true, message: 'Menu item updated', data: item });
});

const remove = catchAsync(async (req, res) => {
  await menuService.remove(req.params.id);
  res.status(httpStatus.OK).json({ success: true, message: 'Menu item deleted' });
});

module.exports = { listPublic, listAll, create, update, remove };
