const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const reservationService = require('../services/reservationService');
const logger = require('../config/logger');

const create = catchAsync(async (req, res) => {
  const reservation = await reservationService.create(req.body);
  logger.info(
    `New reservation from ${reservation.firstName} ${reservation.lastName} for ${reservation.date} ${reservation.time}`
  );
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Reservation request received — we'll confirm by phone shortly.",
    data: reservation,
  });
});

const list = catchAsync(async (req, res) => {
  const result = await reservationService.list(req.query);
  res.status(httpStatus.OK).json({ success: true, ...result });
});

const updateStatus = catchAsync(async (req, res) => {
  const reservation = await reservationService.updateStatus(req.params.id, req.body.status);
  res.status(httpStatus.OK).json({ success: true, message: `Reservation ${req.body.status}`, data: reservation });
});

const remove = catchAsync(async (req, res) => {
  await reservationService.remove(req.params.id);
  res.status(httpStatus.OK).json({ success: true, message: 'Reservation deleted' });
});

module.exports = { create, list, updateStatus, remove };
