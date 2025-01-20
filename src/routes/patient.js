const express = require("express");
const {
  paientLogin,
  patientSignUp,
  createAppointment,
  getAppoinment,
} = require("../controller/patientController");
const { validatePatient } = require("../middleware/patientMiddleware");
const validateApponiment = require("../middleware/apponimentMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const patientRouter = express.Router();

patientRouter.post("/signup", validatePatient, patientSignUp);
patientRouter.post("/login", paientLogin);
patientRouter.post(
  "/appoinment",
  validateApponiment,
  authenticateToken,
  createAppointment
);
patientRouter.get("/appoinment", authenticateToken, getAppoinment);

module.exports = patientRouter;
