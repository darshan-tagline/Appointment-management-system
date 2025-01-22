const sendResponse = require("../utils/responseUtils");
const { tokenVarification, tokenDecode } = require("../utils/token");
const { findPatient } = require("../service/patientServices");
const authorizePatient = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return sendResponse(res, 403, "Access denied. No token provided.");
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    if (!token) {
      return sendResponse(res, 403, "Access denied. No token provided.");
    }

    const {data} = tokenVarification(token);   
    const user = await findPatient({ _id: data });
    if (!user) {
      return sendResponse(res, 404, "User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return sendResponse(res, 401, "Invalid or expired token.");
  }
};

module.exports = authorizePatient;
