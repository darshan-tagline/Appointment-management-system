const express = require("express");
const {
  doctorLogin,
  updateAppointment,
  getAppointmentForDoctor,
  getCase,
  addHearing,
  updateHearing,
  getHearing,
} = require("../controller/doctorController");
const authorizeDoctor = require("../middleware/doctorMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} = require('../controller/doctorController');
const hearingValidatorSchema = require("../validators/hearingValidation");
const doctorValidatorSchema = require("../validators/doctorValidation");

const adminDoctorRouter = express.Router();
const doctorRouter = express.Router();

adminDoctorRouter.post("/", validate(doctorValidatorSchema), createDoctor);
adminDoctorRouter.get("/", getAllDoctors);
adminDoctorRouter.get(":id", getDoctorById);
adminDoctorRouter.put("/:id", updateDoctor);
adminDoctorRouter.delete("/:id", deleteDoctor);

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appoinment", authorizeDoctor, getAppointmentForDoctor);
doctorRouter.put("/appoinment/:id", authorizeDoctor, updateAppointment);
doctorRouter.get("/case", authorizeDoctor, getCase);
doctorRouter.get("/hearing/:id", authorizeDoctor, getHearing);
doctorRouter.post(
  "/hearing",
  authorizeDoctor,
  validate(hearingValidatorSchema),
  addHearing
);
doctorRouter.put("/hearing/:id", authorizeDoctor, updateHearing);

module.exports = { adminDoctorRouter, doctorRouter };
