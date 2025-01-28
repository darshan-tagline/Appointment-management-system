const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  appointmentValidatorSchema,
  appointmentUpdateValidatorSchema,
} = require("../validators/appoinmentValidation");
const {
  createAppointment,
  getAppoinment,
} = require("../controller/patientController");
const {
  getAppointmentForDoctor,
  updateAppointment,
} = require("../controller/doctorController");
const appoinmentRouter = express.Router();
const appointmentRouterForDoctor = express.Router();

appoinmentRouter.get("/", getAppoinment);
appoinmentRouter.post(
  "/",
  validate(appointmentValidatorSchema),
  createAppointment
);

appointmentRouterForDoctor.get("/", getAppointmentForDoctor);
appointmentRouterForDoctor.put(
  "/:id",
  validate(appointmentUpdateValidatorSchema),
  updateAppointment
);

module.exports = { appoinmentRouter, appointmentRouterForDoctor };
