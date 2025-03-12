const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  loginValidatorSchema,
  patientValidatorSchema,
  otpValidatorSchema,
  changePasswordValidatorSchema,
  emailValidatorSchema,
  passwordValidatorSchema,
} = require("../validators/authValidation");
const {
  googleAuth,
  googleAuthCallback,
  googleMiddlware,
} = require("../middleware/googleAuthMiddleware");
const {
  login,
  patientSignUp,
  validateOTP,
  resendOtp,
  forgotPassword,
  resetPassword,
  forgotPasswordVarifyOTP,
  changePassword,
} = require("../controller/authController");
const authorize = require("../middleware/authorizeMiddleware");
const authRouter = express.Router();

authRouter.post("/login", validate(loginValidatorSchema), login);
authRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);
authRouter.post("/validate-otp", validate(otpValidatorSchema), validateOTP);
authRouter.post("/resend-otp", validate(emailValidatorSchema), resendOtp);
authRouter.post(
  "/forgot-password",
  validate(emailValidatorSchema),
  forgotPassword
);

authRouter.post(
  "/forgot-password/validate-otp",
  validate(otpValidatorSchema),
  forgotPasswordVarifyOTP
);
authRouter.post(
  "/reset-password",
  validate(emailValidatorSchema.concat(passwordValidatorSchema)),
  resetPassword
);
authRouter.post(
  "/change-password",
  authorize(["patient", "doctor"]),
  validate(changePasswordValidatorSchema),
  changePassword
);
authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleMiddlware, googleAuthCallback);

module.exports = authRouter;
