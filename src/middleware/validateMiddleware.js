const sendResponse = require("../utils/responseUtils");

const validatee = (schema) => async (req, res, next) => {
  try {
    const dataToValidate = { ...req.body, ...req.query, ...req.params };

    const { error } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log(
        `Validation error: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`
      );
      return sendResponse(
        res,
        400,
        error.details.map((detail) => detail.message).join(", ")
      );
    }

    next();
  } catch (err) {
    console.error("Server error:", err);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = validatee;
