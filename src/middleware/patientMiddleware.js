const sendResponse = require("../utils/responseUtils");
const { tokenVarification, tokenDecode } = require("../utils/token");
const { findPatient } = require("../service/patientServices");
const authorizePatient = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return sendResponse(res, 403, "Access denied. No token provided.");
    }
    const { id } = tokenDecode(token);
    console.log(id);

    const user = await findPatient({ _id: id });
    if (!user) {
      return sendResponse(res, 404, "User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};

module.exports = authorizePatient;
