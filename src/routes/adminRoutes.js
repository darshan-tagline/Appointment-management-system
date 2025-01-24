const express = require("express");
const {
  adminLogin,
 } = require("../controller/adminController");
const authorize = require("../middleware/adminMiddleware");
const validate = require("../middleware/validateMiddleware");
const adminvalidatorSchema = require("../validators/adminValidation");
const categoryRouter = require("./adminRoutes/categoryRoutes");
const medicineRouter = require("./adminRoutes/medicineRoutes");
const adminDoctorRouter = require("./adminRoutes/doctorRoutesForAdmin");

const adminRouter = express.Router();

adminRouter.post("/login", validate(adminvalidatorSchema), adminLogin);
adminRouter.use("/category", authorize, categoryRouter);
adminRouter.use("/medicine", authorize, medicineRouter);
adminRouter.use("/doctor", authorize, adminDoctorRouter);

//Doctor

module.exports = adminRouter;
