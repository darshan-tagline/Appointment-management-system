const Joi = require("joi");

const caseValidatorSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": "Doctor ID must be a valid ObjectId.",
    "any.required": "Doctor ID is required.",
  }),
  patientId: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": "Patient ID must be a valid ObjectId.",
    "any.required": "Patient ID is required.",
  }),
  appointmentId: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": "Patient ID must be a valid ObjectId.",
    "any.required": "Patient ID is required.",
  }),
});

module.exports = caseValidatorSchema;
