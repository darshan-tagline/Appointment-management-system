const Joi = require("joi");

const medicineValidatorSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().lowercase().required().messages({
    "string.base": "Name should be a type of string",
    "string.min": "Name should have at least 3 characters",
    "any.required": "Name is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price should be a type of number",
    "any.required": "Price is required",
    "number.positive": "Price should be a positive number",
  }),
});

const medicineUpdateValidatorSchema = Joi.object({
  name: Joi.string().optional().min(3).max(100).trim().lowercase().messages({
    "string.base": "Name should be a type of string",
    "string.min": "Name should have at least 3 characters",
  }),
  price: Joi.number().optional().positive().messages({
    "number.base": "Price should be a type of number",
    "number.positive": "Price should be a positive number",
  }),
});

module.exports = { medicineValidatorSchema, medicineUpdateValidatorSchema };
