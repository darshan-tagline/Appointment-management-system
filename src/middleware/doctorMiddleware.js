const { sendResponse } = require("../utils/responseUtils");
const { doctorValidation } = require("../validators/doctorValidation");

const validateDoctor = (req, res, next) => {
  const { error } = doctorValidation.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "validation failed", null, error.details);
  }
  next();
};

module.exports = { validateDoctor };
