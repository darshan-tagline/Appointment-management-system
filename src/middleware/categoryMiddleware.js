const { sendResponse } = require("../utils/responseUtils");
const { categoryValidatorSchema } = require("../validators/categoryValidation");

const validateCategory = (req, res, next) => {
  const { error } = categoryValidatorSchema.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "validation failed", null, error.details);
  }
  next();
};

module.exports = { validateCategory };
