const express = require("express");
const validate = require("../middleware/validateMiddleware");
const loginValidatorSchema = require("../validators/loginValidation");
const patientValidatorSchema = require("../validators/patientValidation");
const passport = require("passport");
const {
  googleAuth,
  googleAuthCallback,
  googleMiddlware,
} = require("../middleware/googleAuthMiddleware");
const {
  login,
  patientSignUp,
  validateOTP,
} = require("../controller/authController");
const authRouter = express.Router();

authRouter.post("/login", validate(loginValidatorSchema), login);
authRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);
authRouter.post("/validateOTP", validateOTP);
authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleMiddlware, googleAuthCallback);

module.exports = authRouter;
