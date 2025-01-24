const express = require("express");
const validate = require("../../middleware/validateMiddleware");
const doctorValidatorSchema = require("../../validators/doctorValidation");
const {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} = require("../../controller/adminControllers/doctorControllerForAdmin");

const adminDoctorRouter = express.Router();

adminDoctorRouter.post(
  "/doctor",
  validate(doctorValidatorSchema),
  createDoctor
);
adminDoctorRouter.get("/doctor/:name?", getAllDoctors);
adminDoctorRouter.get("/doctor/:id/id", getDoctorById);
adminDoctorRouter.put(
  "/doctor/:id",
  validate(doctorValidatorSchema),
  updateDoctor
);
adminDoctorRouter.delete("/doctor/:id", deleteDoctor);

module.exports = adminDoctorRouter;
