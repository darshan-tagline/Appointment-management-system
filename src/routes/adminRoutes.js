const express = require("express");
const adminLogin = require("../controller/adminController");
const authorize = require("../middleware/adminMiddleware");
const validate = require("../middleware/validateMiddleware");
const adminvalidatorSchema = require("../validators/adminValidation");
const categoryRouter = require("./categoryRoutes");
const medicineRouter = require("./medicineRoutes");
const { adminDoctorRouter } = require("./doctorRoutes");

const adminRouter = express.Router();

adminRouter.post("/login", validate(adminvalidatorSchema), adminLogin);
adminRouter.use("/category", authorize, categoryRouter);
adminRouter.use("/medicine", authorize, medicineRouter);
adminRouter.use("/doctor", authorize, adminDoctorRouter);

module.exports = adminRouter;
