const Joi = require("joi");

const bannerSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  subtitle: Joi.string().trim().max(100).allow(""),
  tagline: Joi.string().trim().max(200).allow(""),
  imageUrl: Joi.string().trim().uri().allow(""),
  isActive: Joi.boolean(),
});

const bannerUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100),
  subtitle: Joi.string().trim().max(100).allow(""),
  tagline: Joi.string().trim().max(200).allow(""),
  imageUrl: Joi.string().trim().uri().allow(""),
  isActive: Joi.boolean(),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ "string.hex": "Invalid id", "string.length": "Invalid id" }),
});

module.exports = { bannerSchema, bannerUpdateSchema, idParamSchema };
