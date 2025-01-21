const Joi = require("joi");

const hearingValidatorSchema = Joi.object({
  caseId: Joi.string().required().messages({
    "string.base": `"caseId" should be a string`,
    "any.required": `"caseId" is required`,
  }),
  date: Joi.date().required().messages({
    "date.base": `"date" should be a valid date`,
    "any.required": `"date" is required`,
  }),
  description: Joi.string().min(5).required().messages({
    "string.base": `"description" should be a string`,
    "string.min": `"description" should have a minimum length of 5 characters`,
    "any.required": `"description" is required`,
  }),
  status: Joi.string().valid("Completed", "In Progress").default("In Progress").messages({
    "string.base": `"status" should be a string`,
    "any.only": `"status" must be one of the following values:'Completed', 'In Progress'`,
    "any.required": `"status" is required`,
  }),
  prescription: Joi.string().min(5).required().messages({
    "string.base": `"prescription" should be a string`,
    "string.min": `"prescription" should have a minimum length of 5 characters`,
    "any.required": `"prescription" is required`,
  }),
});

module.exports = hearingValidatorSchema;
