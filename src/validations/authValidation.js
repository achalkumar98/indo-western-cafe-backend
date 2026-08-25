const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().trim().lowercase().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().trim().max(60).allow("", null),
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9._-]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "username may only contain letters, numbers, dots, underscores and hyphens",
    }),
  password: Joi.string().min(8).max(72).required().messages({
    "string.min": "password must be at least 8 characters",
  }),
  signupCode: Joi.string().trim().required().messages({
    "any.required": "signup code is required",
    "string.empty": "signup code is required",
  }),
});

module.exports = { loginSchema, registerSchema };
