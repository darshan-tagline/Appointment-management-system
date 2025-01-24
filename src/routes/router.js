const express = require("express");
const adminRouter = require("./adminRoutes");
const { doctorRouter } = require("./doctorRoutes");
const patientRouter = require("./patient");
const router = express.Router();

router.use("/admin", adminRouter);
router.use("/doctor", doctorRouter);
router.use("/patient", patientRouter);

module.exports = router;
