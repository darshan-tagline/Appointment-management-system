const sendResponse = require("../utils/responseUtils");
const passport = require("passport");

const googleAuth = passport.authenticate("google", {
  scope: ["openid", "profile", "email"],
});

const googleMiddlware = (req, res, next) => {
  passport.authenticate("google", {
    failureRedirect: "/signup",
  })(req, res, next);
};
const googleAuthCallback = (req, res) => {
  return sendResponse(res, 200, "Google login successful", {
    patient: req.user,
  });
};

module.exports = {
  googleAuth,
  googleMiddlware,
  googleAuthCallback,
};
