const joi = require("joi");

const idValidatorSchema = joi.string().trim().hex().length(24).required().messages({
  "string.pattern.base": "ID must be a valid ObjectId.",
  "any.required": "ID is required.",
});

module.exports = { idValidatorSchema };
