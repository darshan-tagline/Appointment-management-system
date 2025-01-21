const Joi = require("joi");

const caseValidatorSchema = Joi.object({
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
  
});

module.exports = caseValidatorSchema;
