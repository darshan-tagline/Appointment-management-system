const express = require("express");
const { getCase } = require("../controller/caseController");
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
const { hearingRouter } = require("./hearingRoutes");
const { hearingRequestRouter } = require("./hearingRequestRoutes");
const authorize = require("../middleware/authorizeMiddleware");
const { idValidatorSchema } = require("../validators/commonValidation");
const { getAllMedicines } = require("../controller/medicineController");
const { findAllhearing } = require("../controller/hearingController");
const adminDoctorRouter = express.Router();
const doctorRouter = express.Router();

adminDoctorRouter.post(
  "/",
  authorize("admin"),
  validate(doctorValidatorSchema),
  createDoctor
);
adminDoctorRouter.get("/", authorize("admin"), getAllDoctors);
adminDoctorRouter.get(
  "/:id",
  authorize("admin"),
  validate(idValidatorSchema),
  getDoctorById
);
adminDoctorRouter.put(
  "/:id",
  authorize("admin"),
  validate(idValidatorSchema.concat(doctorUpdateValidatorSchema)),
  updateDoctor
);
adminDoctorRouter.delete(
  "/:id",
  authorize("admin"),
  validate(idValidatorSchema),
  deleteDoctor
);

doctorRouter.use(
  "/appointment",
  authorize("doctor"),
  appointmentRouterForDoctor
);
// doctorRouter.get("/hearings", authorize("doctor"), findAllhearing);
doctorRouter.use("/hearing", authorize("doctor"), hearingRouter);
doctorRouter.use("/hearingrequest", authorize("doctor"), hearingRequestRouter);
doctorRouter.get("/case", authorize("doctor"), getCase);
doctorRouter.get("/medicine", authorize("doctor"), getAllMedicines);

module.exports = { adminDoctorRouter, doctorRouter };
