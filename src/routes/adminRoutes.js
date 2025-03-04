const express = require("express");
const categoryRouter = require("./categoryRoutes");
const medicineRouter = require("./medicineRoutes");
const { adminDoctorRouter } = require("./doctorRoutes");
const createAdmin = require("../utils/createAdmin");
const validate = require("../middleware/validateMiddleware");
const { patientValidatorSchema } = require("../validators/authValidation");

const adminRouter = express.Router();

adminRouter.post("/add-admin", validate(patientValidatorSchema), createAdmin);
adminRouter.use("/category", categoryRouter);
adminRouter.use("/medicine", medicineRouter);
adminRouter.use("/doctor", adminDoctorRouter);

module.exports = adminRouter;
