const Joi = require("joi");

const galleryItemSchema = Joi.object({
  imageUrl: Joi.string().trim().uri().required(),
  label: Joi.string().trim().max(60).allow(""),
  span: Joi.string().valid("normal", "tall", "wide"),
  sortOrder: Joi.number().integer().min(0),
  visible: Joi.boolean(),
});

const galleryItemUpdateSchema = Joi.object({
  imageUrl: Joi.string().trim().uri(),
  label: Joi.string().trim().max(60).allow(""),
  span: Joi.string().valid("normal", "tall", "wide"),
  sortOrder: Joi.number().integer().min(0),
  visible: Joi.boolean(),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ "string.hex": "Invalid id", "string.length": "Invalid id" }),
});

module.exports = { galleryItemSchema, galleryItemUpdateSchema, idParamSchema };
