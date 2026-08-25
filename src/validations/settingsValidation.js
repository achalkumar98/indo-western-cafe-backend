const Joi = require("joi");

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
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ "string.hex": "Invalid id", "string.length": "Invalid id" }),
});

module.exports = { settingsUpdateSchema, idParamSchema };
