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
  getAllAppointment,
  getAppointmentById,
  deleteAppointment,
} = require("../controller/appointmentController");
const { idValidatorSchema } = require("../validators/commonValidation");
const appoinmentRouter = express.Router();
const appointmentRouterForDoctor = express.Router();
const appointmentRouterForAdmin = express.Router();

//patient
appoinmentRouter.get("/", getAppoinment);
appoinmentRouter.post(
  "/",
  validate(appointmentValidatorSchema),
  createAppointment
);

//doctor
appointmentRouterForDoctor.get("/", getAppointmentForDoctor);
appointmentRouterForDoctor.put(
  "/:id",
  validate(idValidatorSchema.concat(appointmentUpdateValidatorSchema)),
  updateAppointment
);

// admin
appointmentRouterForAdmin.get("/", getAllAppointment);
appointmentRouterForAdmin.get(
  "/:id",
  validate(idValidatorSchema),
  getAppointmentById
);
appointmentRouterForAdmin.put(
  "/:id",
  validate(idValidatorSchema.concat(appointmentUpdateValidatorSchema)),
  updateAppointment
);
appointmentRouterForAdmin.delete(
  "/:id",
  validate(idValidatorSchema),
  deleteAppointment
);
module.exports = {
  appoinmentRouter,
  appointmentRouterForDoctor,
  appointmentRouterForAdmin,
};
