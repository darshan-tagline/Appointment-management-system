const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const { findUser } = require("../service/userServices");

const authorize = (requiredRole) => {
  return async (req, res, next) => {
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

      let decoded;
      try {
        decoded = tokenVarification(token);
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError.message);
        return sendResponse(res, 401, "Invalid or expired JWT token.");
      }
      const { id, role } = decoded.payload;
      const user = await findUser({ _id: id, role });

      if (!user) {
        return sendResponse(res, 404, "User not found.");
      }

      if (requiredRole && user.role !== requiredRole) {
        return sendResponse(
          res,
          403,
          "Access denied. Insufficient permissions."
        );
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Authorization error:>>>>>", error);
      return sendResponse(res, 500, "Server error.");
    }
  };
};

module.exports = authorize;
