const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const bannerService = require('../services/bannerService');
const logger = require('../config/logger');

const getActive = catchAsync(async (req, res) => {
  const banner = await bannerService.getActive();
  res.status(httpStatus.OK).json({ success: true, data: banner || null });
});

const listAll = catchAsync(async (req, res) => {
  const data = await bannerService.listAll();
  res.status(httpStatus.OK).json({ success: true, count: data.length, data });
});

const create = catchAsync(async (req, res) => {
  const banner = await bannerService.create(req.body);
  logger.info(`Banner created: ${banner.title}`);
  res.status(httpStatus.CREATED).json({ success: true, message: 'Banner created', data: banner });
});

const update = catchAsync(async (req, res) => {
  const banner = await bannerService.update(req.params.id, req.body);
  res.status(httpStatus.OK).json({ success: true, message: 'Banner updated', data: banner });
});

const remove = catchAsync(async (req, res) => {
  await bannerService.remove(req.params.id);
  res.status(httpStatus.OK).json({ success: true, message: 'Banner deleted' });
});

module.exports = { getActive, listAll, create, update, remove };
