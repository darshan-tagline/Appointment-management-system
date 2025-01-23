const Joi = require("joi");

const hearingRequestValidatorSchema = Joi.object({
  caseId: Joi.string().required().trim(),
  patientId: Joi.string().hex().length(24).messages({
    "string.pattern.base": "Patient ID must be a valid ObjectId.",
    "any.required": "Patient ID is required.",
  }),
  reason: Joi.string().required().trim(),
  status: Joi.string().valid("open", "closed", "pending").default("pending"),
});

module.exports = hearingRequestValidatorSchema;