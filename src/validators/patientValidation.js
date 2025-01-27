const Joi = require("joi");

const patientValidatorSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "any.required": "Name is required.",
  }),
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[a-z]{2,7}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Email must be a valid email address (e.g., example@domain.com).",
      "any.required": "Email is required.",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

module.exports = patientValidatorSchema;
