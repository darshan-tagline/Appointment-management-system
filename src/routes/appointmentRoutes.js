const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  appointmentValidatorSchema,
  appointmentUpdateValidatorSchema,
} = require("../validators/appoinmentValidation");
const {
  getAppointmentForDoctor,
  updateAppointment,
  createAppointment,
  getAppoinment,
} = require("../controller/appointmentController");
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
