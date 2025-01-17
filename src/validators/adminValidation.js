const Joi = require("joi");

const adminvalidatorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { adminvalidatorSchema };
