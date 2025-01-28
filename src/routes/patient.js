const express = require("express");
const {
  patientSignUp,
  createAppointment,
  getAppoinment,
  viewCase,
  getHearing,
  addHearingRequest,
  validateOTP,
} = require("../controller/patientController");
const validate = require("../middleware/validateMiddleware");
const patientValidatorSchema = require("../validators/patientValidation");
const {
  appointmentValidatorSchema,
} = require("../validators/appoinmentValidation");
const {
  hearingRequestValidatorSchema,
} = require("../validators/hearingRequestValidation");
const passport = require("passport");
const {
  googleAuth,
  googleAuthCallback,
} = require("../middleware/googleAuthMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const patientRouter = express.Router();

patientRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);

patientRouter.get("/auth/google", googleAuth);

patientRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signup" }),
  googleAuthCallback
);

patientRouter.post("/validate-otp", validateOTP);
// patientRouter.post("/login", paientLogin);
patientRouter.post(
  "/appoinment",
  authorize(["patient"]),
  validate(appointmentValidatorSchema),
  createAppointment
);
patientRouter.get("/appoinment", authorize(["patient"]), getAppoinment);
patientRouter.get("/case", authorize(["patient"]), viewCase);
patientRouter.get("/hearingrequest", authorize(["patient"]), getHearing);
patientRouter.post(
  "/hearingrequest",
  authorize(["patient"]),
  validate(hearingRequestValidatorSchema),
  addHearingRequest
);

module.exports = patientRouter;
