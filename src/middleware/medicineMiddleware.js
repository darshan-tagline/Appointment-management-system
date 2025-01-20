const { sendResponse } = require("../utils/responseUtils");
const { medicineValidatorSchema } = require("../validators/medicineValidation");

const validateMedicine = (req, res, next) => {
  const { error } = medicineValidatorSchema.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "validation failed", null, error.details);
  }
  next();
};

module.exports = { validateMedicine };
