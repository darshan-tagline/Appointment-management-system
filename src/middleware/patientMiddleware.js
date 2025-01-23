const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const { findPatient } = require("../service/patientServices");
const { refreshAccessToken } = require("../utils/passport");

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

    let decoded;
    try {
      decoded = tokenVarification(token);
    } catch (error) {
      return sendResponse(res, 401, "Invalid or expired token.");
    }

    const { data: patientId } = decoded;
  
    const user = await findPatient({ _id: patientId });

    if (!user) {
      return sendResponse(res, 404, "User not found.");
    }

    if (user.refreshToken) {
      const tokenExpiryTime = decoded.exp * 1000;
      const currentTime = new Date().getTime();

      if (currentTime > tokenExpiryTime) {
        const { access_token, refresh_token } = await refreshAccessToken(
          user.refreshToken,
          user
        );

        res.setHeader("New-Access-Token", access_token);
        res.setHeader("New-Refresh-Token", refresh_token);

        req.newAccessToken = access_token;
        req.newRefreshToken = refresh_token;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return sendResponse(res, 401, "Invalid or expired token.");
  }
};

module.exports = authorizePatient;
