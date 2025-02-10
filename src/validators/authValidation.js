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

const otpValidatorSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[a-z]{2,7}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Email must be a valid email address (e.g., example@domain.com).",
      "any.required": "Email is required.",
    }),
  otp: Joi.string()
    .length(4)
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      "string.empty": "OTP is required.",
      "string.length": "OTP must be exactly 4 digits.",
      "string.pattern.base": "OTP must contain only numbers.",
    }),
});

const changePasswordValidatorSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format. Please enter a valid email.",
    "string.empty": "Email is required.",
    "any.required": "Email is a mandatory field.",
  }),
  oldPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is a mandatory field.",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is a mandatory field.",
  }),
});

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

const emailValidatorSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[a-z]{2,7}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Email must be a valid email address (e.g., example@domain.com).",
      "any.required": "Email is required.",
    }),
});

const passwordValidatorSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

module.exports = {
  otpValidatorSchema,
  loginValidatorSchema,
  changePasswordValidatorSchema,
  patientValidatorSchema,
  emailValidatorSchema,
  passwordValidatorSchema,
};
