const express = require("express");
const categoryRouter = require("./categoryRoutes");
const medicineRouter = require("./medicineRoutes");
const { adminDoctorRouter } = require("./doctorRoutes");
const createAdmin = require("../utils/createAdmin");
const validate = require("../middleware/validateMiddleware");
const { patientValidatorSchema } = require("../validators/authValidation");
const { getAllHearings } = require("../controller/hearingController");
const { getAllCases } = require("../controller/caseController");
const { getAllAppointment } = require("../controller/appointmentController");
const { findAllPatient } = require("../service/userServices");

const adminRouter = express.Router();

adminRouter.post("/add-admin", validate(patientValidatorSchema), createAdmin);
adminRouter.use("/category", categoryRouter);
adminRouter.use("/medicine", medicineRouter);
adminRouter.use("/doctor", adminDoctorRouter);
adminRouter.use("/patient", findAllPatient);
adminRouter.use("/appointments", getAllAppointment);
adminRouter.use("/hearings", getAllHearings);
adminRouter.use("/cases", getAllCases);

module.exports = adminRouter;
