const express = require("express");
const {
  paientLogin,
  patientSignUp,
  createAppointment,
  getAppoinment,
  viewCase,
  getHearing,
  addHearingRequest,
  validateOTP,
} = require("../controller/patientController");
const validate = require("../middleware/validateMiddleware");
const {
  authorizePatient,
  googleAuth,
  googleAuthCallback,
} = require("../middleware/patientMiddleware");
const patientValidatorSchema = require("../validators/patientValidation");
const appointmentValidatorSchema = require("../validators/appoinmentValidation");
const hearingRequestValidatorSchema = require("../validators/hearingRequestValidation");
const passport = require("passport");
const patientRouter = express.Router();

patientRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);

patientRouter.get("/auth/google", googleAuth);

patientRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signup" }),
  googleAuthCallback
);

patientRouter.post("/validate-otp", validateOTP);
patientRouter.post("/login", paientLogin);
patientRouter.post(
  "/appoinment",
  authorizePatient,
  validate(appointmentValidatorSchema),
  createAppointment
);
patientRouter.get("/appoinment", authorizePatient, getAppoinment);
patientRouter.get("/case", authorizePatient, viewCase);
patientRouter.get("/hearingrequest/:id", authorizePatient, getHearing);
patientRouter.post(
  "/hearingrequest",
  authorizePatient,
  validate(hearingRequestValidatorSchema),
  addHearingRequest
);

module.exports = patientRouter;
