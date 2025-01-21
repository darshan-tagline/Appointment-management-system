const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const patientValidation = require("../validators/patientValidation");

const validatePatient = (req, res, next) => {
  const { error } = patientValidation.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "validation failed", null, error.details);
  }
  next();
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return sendResponse(res, 403, "Access denied. No token provided.");
  }

  try {
    const decoded = tokenVarification (token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};

module.exports = { validatePatient, authenticateToken };
