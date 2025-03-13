const express = require("express");
const categoryRouter = require("./categoryRoutes");
const medicineRouter = require("./medicineRoutes");
const { adminDoctorRouter } = require("./doctorRoutes");
const createAdmin = require("../utils/createAdmin");
const validate = require("../middleware/validateMiddleware");
const { patientValidatorSchema } = require("../validators/authValidation");
const { getAllCases } = require("../controller/caseController");
const { findAllPatient } = require("../service/userServices");
const { appointmentRouterForAdmin } = require("./appointmentRoutes");
const { hearingRouterForAdmin } = require("./hearingRoutes");
const { hearingRequestRouterForAdmin } = require("./hearingRequestRoutes");

const adminRouter = express.Router();

adminRouter.post("/add-admin", validate(patientValidatorSchema), createAdmin);
adminRouter.use("/category", categoryRouter);
adminRouter.use("/medicine", medicineRouter);
adminRouter.use("/doctor", adminDoctorRouter);
adminRouter.use("/appointments", appointmentRouterForAdmin);
adminRouter.use("/hearings", hearingRouterForAdmin);
adminRouter.use("/hearingrequest", hearingRequestRouterForAdmin);
adminRouter.use("/cases", getAllCases);
adminRouter.use("/patient", findAllPatient);



module.exports = adminRouter;
