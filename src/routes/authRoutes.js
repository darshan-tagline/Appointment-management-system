const express = require("express");
const login = require("../utils/loginUtils");
const validate = require("../middleware/validateMiddleware");
const loginValidatorSchema = require("../validators/loginValidation");
const {
  patientSignUp,
  validateOTP,
} = require("../controller/patientController");
const patientValidatorSchema = require("../validators/patientValidation");
const passport = require("passport");
const {
  googleAuth,
  googleAuthCallback,
} = require("../middleware/googleAuthMiddleware");
const authRouter = express.Router();

authRouter.post("/login", validate(loginValidatorSchema), login);
authRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);
authRouter.post("/validateOTP", validateOTP);
authRouter.get("/google", googleAuth);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signup" }),
  googleAuthCallback
);

module.exports = authRouter;
