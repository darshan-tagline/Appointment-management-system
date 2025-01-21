const Joi = require("joi");

const caseValidator = Joi.object({
  doctorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Doctor ID must be a valid ObjectId.",
      "any.required": "Doctor ID is required.",
    }),
  patientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Patient ID must be a valid ObjectId.",
      "any.required": "Patient ID is required.",
    }),
  appointmentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Patient ID must be a valid ObjectId.",
      "any.required": "Patient ID is required.",
    }),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional()
    .messages({
      "string.empty": "Status cannot be an empty string.",
      "any.only": "Status must be one of 'pending', 'approved', or 'rejected'.",
    }),
});

module.exports = caseValidator;
