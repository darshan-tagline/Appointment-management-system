const express = require("express");
const {
  paientLogin,
  patientSignUp,
  createAppointment,
  getAppoinment,
  viewCase,
} = require("../controller/patientController");

const validate = require("../middleware/validateMiddleware");
const authorizePatient = require("../middleware/patientMiddleware");
const patientValidatorSchema = require("../validators/patientValidation");
const appointmentValidatorSchema = require("../validators/appoinmentValidation");
const patientRouter = express.Router();

patientRouter.post("/signup", validate(patientValidatorSchema), patientSignUp);
patientRouter.post("/login", paientLogin);
patientRouter.post(
  "/appoinment",
  validate(appointmentValidatorSchema),
  createAppointment
);
patientRouter.get("/appoinment", authorizePatient, getAppoinment);
patientRouter.get("/case", authorizePatient, viewCase);

module.exports = patientRouter;
