const Joi = require("joi");

// Public: guest submits a table request.
const reservationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{6,20}$/)
    .required()
    .messages({ "string.pattern.base": "Enter a valid phone number" }),
  email: Joi.string().trim().email().allow(""),
  partySize: Joi.number().min(1).max(30).required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({ "string.pattern.base": "Date must be in YYYY-MM-DD format" }),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({ "string.pattern.base": "Time must be in HH:mm format" }),
  occasion: Joi.string().trim().max(60).allow(""),
  notes: Joi.string().trim().max(300).allow(""),
});

// Admin: query params for the reservation listing.
const listQuerySchema = Joi.object({
  status: Joi.string().valid("all", "pending", "confirmed", "cancelled"),
  search: Joi.string().trim().allow(""),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sort: Joi.string().valid("-createdAt", "createdAt", "date", "-date"),
});

// Admin: status change payload.
const statusUpdateSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "cancelled").required(),
});

// Shared: validate a Mongo ObjectId route param.
const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ "string.hex": "Invalid id", "string.length": "Invalid id" }),
});

module.exports = { reservationSchema, listQuerySchema, statusUpdateSchema, idParamSchema };
