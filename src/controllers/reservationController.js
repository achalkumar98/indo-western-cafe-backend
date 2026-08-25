const asyncHandler = require("../middleware/asyncHandler");
const reservationService = require("../services/reservationService");
const logger = require("../utils/logger");

// POST /api/reservations (public)
const create = asyncHandler(async (req, res) => {
  const reservation = await reservationService.create(req.body);
  logger.info(`New reservation from ${reservation.name} for ${reservation.date} ${reservation.time}`);
  res.status(201).json({
    success: true,
    message: "Reservation request received — we'll confirm by phone shortly.",
    data: reservation,
  });
});

// GET /api/reservations (admin)
const list = asyncHandler(async (req, res) => {
  const result = await reservationService.list(req.query);
  res.json({ success: true, ...result });
});

// PATCH /api/reservations/:id/status (admin)
const updateStatus = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateStatus(req.params.id, req.body.status);
  res.json({ success: true, message: `Reservation ${req.body.status}`, data: reservation });
});

// DELETE /api/reservations/:id (admin)
const remove = asyncHandler(async (req, res) => {
  await reservationService.remove(req.params.id);
  res.json({ success: true, message: "Reservation deleted" });
});

module.exports = { create, list, updateStatus, remove };
