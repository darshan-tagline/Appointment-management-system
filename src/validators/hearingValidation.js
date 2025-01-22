const Joi = require("joi");

const hearingValidatorSchema = Joi.object({
  caseId: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": "Case ID must be a valid ObjectId.",
    "any.required": "Case ID is required.",
  }),
  description: Joi.string().min(3).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 3 characters long.",
  }),
  status: Joi.string()
    .valid("resolved", "In Progress")
    .default("In Progress")
    .messages({
      "string.valid": "Status must be either 'resolved' or 'In Progress'.",
    }),
  prescription: Joi.array()
    .items(
      Joi.object({
        medicineId: Joi.string().hex().length(24).required().messages({
          "string.pattern.base": "Medicine ID must be a valid ObjectId.",
          "any.required": "Medicine ID is required.",
        }),
        dosage: Joi.string().min(1).required().messages({
          "string.empty": "Dosage is required.",
          "string.min": "Dosage must be at least 1 character long.",
        }),
        duration: Joi.string().min(1).required().messages({
          "string.empty": "Duration is required.",
          "string.min": "Duration must be at least 1 character long.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Prescription must contain at least one medicine.",
      "array.required": "Prescription is required.",
    }),
});

module.exports = hearingValidatorSchema;
