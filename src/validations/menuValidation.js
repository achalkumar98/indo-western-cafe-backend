const Joi = require("joi");

const categories = [
  "Beverages",
  "Starters",
  "Mains",
  "Desserts",
  "Egg",
  "Dal",
  "Rice",
  "Roti",
  "Naan",
  "Biryani",
  "Salads",
];

const menuItemSchema = Joi.object({
  category: Joi.string()
    .valid(...categories)
    .required(),
  name: Joi.string().trim().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  isVeg: Joi.boolean().required(),
  signature: Joi.boolean(),
  available: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
});

const menuItemUpdateSchema = Joi.object({
  category: Joi.string().valid(...categories),
  name: Joi.string().trim().min(2).max(100),
  price: Joi.number().min(0),
  isVeg: Joi.boolean(),
  signature: Joi.boolean(),
  available: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({ "string.hex": "Invalid id", "string.length": "Invalid id" }),
});

module.exports = { menuItemSchema, menuItemUpdateSchema, idParamSchema, categories };
