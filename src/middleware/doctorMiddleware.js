const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const { findDoctor } = require("../service/doctorServices");

const authorizeDoctor = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return sendResponse(res, 403, "Access denied. No token provided.");
    }
    const { email } = tokenVarification(token);
    const user = await findDoctor(email);
    if (!user) {
      return sendResponse(res, 404, "User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};

module.exports = authorizeDoctor;
