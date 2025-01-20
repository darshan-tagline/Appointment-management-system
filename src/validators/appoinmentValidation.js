const Joi = require("joi");

const appointmentValidator = Joi.object({
  doctorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Doctor ID must be a valid ObjectId.",
      "any.required": "Doctor ID is required.",
    }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date.",
    "any.required": "Date is required.",
  }),
  timeSlot: Joi.string().required().messages({
    "string.empty": "Time slot cannot be empty.",
    "any.required": "Time slot is required.",
  }),
  symptoms: Joi.string().optional().messages({
    "string.empty": "Symptoms cannot be an empty string.",
  }),
  status: Joi.string()
    .valid("pending", "approved", "rejected") 
    .optional()
    .messages({
      "string.empty": "Status cannot be an empty string.",
      "any.only": "Status must be one of 'pending', 'approved', or 'rejected'.",
    }),
});

module.exports = appointmentValidator;
