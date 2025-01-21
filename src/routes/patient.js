const express = require("express");
const {
  paientLogin,
  patientSignUp,
  createAppointment,
  getAppoinment,
} = require("../controller/patientController");

const validate = require("../middleware/validateMiddleware");
const authorizePatient = require("../middleware/patientMiddleware");
const patientValidator = require("../validators/patientValidation");
const appointmentValidator = require("../validators/appoinmentValidation");
const patientRouter = express.Router();

patientRouter.post("/signup", validate(patientValidator), patientSignUp);
patientRouter.post("/login", paientLogin);
patientRouter.post(
  "/appoinment",
  validate(appointmentValidator),
  createAppointment
);
patientRouter.get("/appoinment", getAppoinment);

module.exports = patientRouter;
