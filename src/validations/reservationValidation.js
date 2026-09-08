const Joi = require('joi');

const reservationSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(40).required(),
  lastName: Joi.string().trim().min(1).max(40).required(),
  customerMobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({ 'string.pattern.base': 'Enter a valid 10-digit Indian mobile number' }),
  email: Joi.string().trim().email().allow(''),
  tableSize: Joi.number().min(1).max(30).required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({ 'string.pattern.base': 'Date must be in YYYY-MM-DD format' }),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({ 'string.pattern.base': 'Time must be in HH:mm format' }),
  occasion: Joi.string().trim().max(60).allow(''),
  notes: Joi.string().trim().max(300).allow(''),
});

const listQuerySchema = Joi.object({
  status: Joi.string().valid('all', 'pending', 'confirmed', 'cancelled'),
  search: Joi.string().trim().allow(''),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sort: Joi.string().valid('-createdAt', 'createdAt', 'date', '-date'),
});

const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled').required(),
});

const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ 'string.hex': 'Invalid id', 'string.length': 'Invalid id' }),
});

module.exports = { reservationSchema, listQuerySchema, statusUpdateSchema, idParamSchema };
