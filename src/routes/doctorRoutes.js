const express = require("express");
const { getCase } = require("../controller/doctorController");
const validate = require("../middleware/validateMiddleware");
const {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} = require("../controller/doctorController");
const {
  doctorValidatorSchema,
  doctorUpdateValidatorSchema,
} = require("../validators/doctorValidation");
const { appointmentRouterForDoctor } = require("./appointmentRoutes");
const hearingRouter = require("./hearingRoutes");
const { hearingRequestRouter } = require("./hearingRequestRoutes");

const adminDoctorRouter = express.Router();
const doctorRouter = express.Router();

adminDoctorRouter.post("/", validate(doctorValidatorSchema), createDoctor);
adminDoctorRouter.get("/", getAllDoctors);
adminDoctorRouter.get("/:id", getDoctorById);
adminDoctorRouter.put(
  "/:id",
  validate(doctorUpdateValidatorSchema),
  updateDoctor
);
adminDoctorRouter.delete("/:id", deleteDoctor);

doctorRouter.use("/appointment", appointmentRouterForDoctor);
doctorRouter.use("/hearing", hearingRouter);
doctorRouter.use("/hearingrequest", hearingRequestRouter);
doctorRouter.get("/case", getCase);

module.exports = { adminDoctorRouter, doctorRouter };
