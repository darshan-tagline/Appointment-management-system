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
const sendResponse = require("../utils/responseUtils");
const validate = require("../middleware/validateMiddleware");
const authorizePatient = require("../middleware/patientMiddleware");
const patientValidatorSchema = require("../validators/patientValidation");
const appointmentValidatorSchema = require("../validators/appoinmentValidation");
const hearingRequestValidatorSchema = require("../validators/hearingRequestValidation");
const passport = require("passport");
const patientRouter = express.Router();

patientRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);

patientRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

patientRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signup" }),
  (req, res) => {
    return sendResponse(res, 200, "Google login successful", {
      patient: req.user,
    });
  }
);

patientRouter.post("/validate-otp", validateOTP);
patientRouter.post("/login", paientLogin);
patientRouter.post(
  "/appoinment",
  validate(appointmentValidatorSchema),
  createAppointment
);
patientRouter.get("/appoinment", authorizePatient, getAppoinment);
patientRouter.get("/case", authorizePatient, viewCase);
patientRouter.get("/hearingrequest/:id", authorizePatient, getHearing);
patientRouter.post("/hearingrequest", authorizePatient, addHearingRequest);

module.exports = patientRouter;
