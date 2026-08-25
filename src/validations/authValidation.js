const Joi = require("joi");

// A "username" can be either a plain handle (achal) or a full email address
// (achalkumar@gmail.com). Both are normalised to lowercase before storage.
const usernameField = Joi.alternatives()
  .try(
    // Plain handle: letters, numbers, dots, underscores, hyphens — 3-60 chars
    Joi.string()
      .trim()
      .lowercase()
      .min(3)
      .max(60)
      .pattern(/^[a-z0-9._-]+$/)
      .messages({
        "string.pattern.base":
          "Username may only contain letters, numbers, dots, underscores or hyphens",
      }),
    // Full e-mail address
    Joi.string().trim().lowercase().email({ tlds: { allow: false } })
  )
  .required()
  .messages({
    "alternatives.match": "Enter a valid username or email address",
    "any.required": "Username or email is required",
  });

const loginSchema = Joi.object({
  username: usernameField,
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().trim().max(60).allow("", null),
  username: usernameField,
  password: Joi.string().min(8).max(72).required().messages({
    "string.min": "Password must be at least 8 characters",
  }),
  signupCode: Joi.string().trim().required().messages({
    "any.required": "Signup code is required",
    "string.empty": "Signup code is required",
  }),
});

module.exports = { loginSchema, registerSchema };
