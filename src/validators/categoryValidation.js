const Joi = require("joi");

const categoryValidatorSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .regex(/^[A-Za-z\s\-&]+$/)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Category name cannot be empty",
      "string.min": "Category name must be at least 3 characters long",
      "string.max": "Category name cannot exceed 50 characters",
      "string.pattern.base":
        "Category name must only contain letters, spaces, hyphens, or ampersands",
      "any.required": "Category name is required",
    }),

  description: Joi.string().min(5).max(255).trim().required().messages({
    "string.empty": "Category description cannot be empty",
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 255 characters",
    "any.required": "Category description is required",
  }),
});

const categoryUpdateValidatorSchema = Joi.object({
  name: Joi.string()
    .optional()
    .min(3)
    .max(50)
    .regex(/^[A-Za-z\s\-&]+$/)
    .trim()
    .lowercase()
    .messages({
      "string.min": "Category name must be at least 3 characters long",
      "string.max": "Category name cannot exceed 50 characters",
      "string.pattern.base":
        "Category name must only contain letters, spaces, hyphens, or ampersands",
    }),

  description: Joi.string().optional().min(5).max(255).trim().messages({
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 255 characters",
  }),
});

module.exports = { categoryValidatorSchema, categoryUpdateValidatorSchema };
