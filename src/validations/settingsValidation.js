const Joi = require("joi");

const hourlySlots = Joi.array().items(Joi.number().min(0).max(100)).length(12);

const daySchedule = Joi.object({
  day: Joi.string().valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun").required(),
  opensAt: Joi.string()
    .trim()
    .pattern(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)
    .messages({ "string.pattern.base": "opensAt must be like 11:00 AM" }),
  closesAt: Joi.string()
    .trim()
    .pattern(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)
    .messages({ "string.pattern.base": "closesAt must be like 10:00 PM" }),
  weekOff: Joi.boolean(),
});

const settingsUpdateSchema = Joi.object({
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{6,20}$/)
    .messages({ "string.pattern.base": "Enter a valid phone number" }),
  address: Joi.string().trim().min(5).max(300),
  closesAt: Joi.string()
    .trim()
    .pattern(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)
    .messages({ "string.pattern.base": "closesAt must be like 10:00 PM" }),
  isOpenNow: Joi.boolean(),
  priceRange: Joi.string().trim().max(30),
  instagramUrl: Joi.string().trim().uri().allow(""),
  instagramHandle: Joi.string().trim().max(60).allow(""),
  directionsUrl: Joi.string().trim().uri().allow(""),
  highlights: Joi.array().items(Joi.string().trim().max(60)).max(10),
  rating: Joi.number().min(0).max(5),
  reviewCount: Joi.number().integer().min(0),
  reviewSummary: Joi.string().trim().max(600).allow(""),
  reportedByCount: Joi.number().integer().min(0),
  popularTimes: Joi.object({
    Mon: hourlySlots,
    Tue: hourlySlots,
    Wed: hourlySlots,
    Thu: hourlySlots,
    Fri: hourlySlots,
    Sat: hourlySlots,
    Sun: hourlySlots,
  }),
  weekSchedule: Joi.array().items(daySchedule).max(7),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ "string.hex": "Invalid id", "string.length": "Invalid id" }),
});

module.exports = { settingsUpdateSchema, idParamSchema };
