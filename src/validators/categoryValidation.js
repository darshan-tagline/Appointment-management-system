const Joi = require("joi");

const categoryValidatorSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .regex(/^[A-Za-z]+$/)
    .message(
      "Category name must only contain letters and cannot contain numbers, spaces, or special characters"
    )
    .custom((value, helpers) => {
      return value.toLowerCase();
    })
    .messages({
      "string.empty": "Category name cannot be empty",
      "string.min": "Category name must be at least 3 characters long",
      "string.max": "Category name cannot exceed 50 characters",
    }),

  description: Joi.string().min(5).max(255).required().messages({
    "string.empty": "Category description cannot be empty",
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 255 characters",
  }),
});

module.exports =  categoryValidatorSchema ;
