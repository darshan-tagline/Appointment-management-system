const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return sendResponse(res, 403, "Access denied. No token provided.");
  }

  try {
    const decoded = tokenVarification(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};

module.exports = authenticateToken;
