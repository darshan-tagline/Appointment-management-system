const express = require("express");
const categoryRouter = require("./categoryRoutes");
const medicineRouter = require("./medicineRoutes");
const { adminDoctorRouter } = require("./doctorRoutes");

const adminRouter = express.Router();

// adminRouter.post("/login", validate(adminvalidatorSchema), adminLogin);
adminRouter.use("/category", categoryRouter);
adminRouter.use("/medicine", medicineRouter);
adminRouter.use("/doctor", adminDoctorRouter);

module.exports = adminRouter;
