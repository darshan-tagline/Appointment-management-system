const sendResponse = require("../utils/responseUtils");
const appointmentValidator = require("../validators/appoinmentValidation");

const validateApponiment = (req, res, next) => {
  const { error } = appointmentValidator.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "validation failed", null, error.details);
  }
  next();
};

module.exports = validateApponiment;
