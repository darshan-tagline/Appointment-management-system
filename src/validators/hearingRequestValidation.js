const Joi = require("joi");

const hearingRequestValidatorSchema = Joi.object({
  caseId: Joi.string().required().trim(),
  patientId: Joi.string().hex().length(24).messages({
    "string.pattern.base": "Patient ID must be a valid ObjectId.",
    "any.required": "Patient ID is required.",
  }),
  reason: Joi.string().required().trim(),
  status: Joi.string()
    .valid("approved", "rejected", "pending", "completed")
    .default("pending"),
});

const hearingRequestUpdateValidatorSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid("approved", "rejected", "pending", "completed")
    .default("pending"),
});

module.exports = {
  hearingRequestValidatorSchema,
  hearingRequestUpdateValidatorSchema,
};
