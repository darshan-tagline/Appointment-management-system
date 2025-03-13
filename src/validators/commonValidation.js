const Joi = require("joi");

const idValidatorSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": `"id" must be a valid MongoDB ObjectId`,
  }),
});

module.exports = { idValidatorSchema };
