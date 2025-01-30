const Joi = require("joi");

const loginValidatorSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format. Please enter a valid email.",
    "string.empty": "Email is required.",
    "any.required": "Email is a mandatory field.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is a mandatory field.",
  }),
});

module.exports = loginValidatorSchema;
