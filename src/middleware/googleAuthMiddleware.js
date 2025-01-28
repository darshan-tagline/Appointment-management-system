const sendResponse = require("../utils/responseUtils");
const passport = require("passport");

const googleAuth = passport.authenticate("google", {
  scope: ["openid", "profile", "email"],
});

const googleAuthCallback = (req, res) => {
  return sendResponse(res, 200, "Google login successful", {
    patient: req.user,
  });
};

module.exports = {
  googleAuth,
  googleAuthCallback,
};
