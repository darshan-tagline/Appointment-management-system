const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const { findPatientByVal } = require("../service/patientServices");
const passport = require("passport");

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

    let user;

    try {
      const decoded = await tokenVarification(token);

      const { data: patientId } = decoded;
      user = await findPatientByVal({ _id: patientId });      
      if (!user) {
        return sendResponse(res, 404, "User not found.");
      }
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);
      return sendResponse(res, 401, "Invalid or expired JWT token.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return sendResponse(res, 500, "Server error.");
  }
};

const googleAuth = passport.authenticate("google", {
  scope: ["openid", "profile", "email"],
});

const googleAuthCallback = (req, res) => {
  return sendResponse(res, 200, "Google login successful", {
    patient: req.user,
  });
};

module.exports = {
  authorizePatient,
  googleAuth,
  googleAuthCallback,
};
