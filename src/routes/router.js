const express = require("express");
const adminRouter = require("./adminRoutes");
const { doctorRouter } = require("./doctorRoutes");
const patientRouter = require("./patient");
const authorize = require("../middleware/authorizeMiddleware");
const authRouter = require("./authRoutes");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin", authorize("admin"), adminRouter);
router.use("/doctor", doctorRouter);
router.use("/patient", authorize("patient"), patientRouter);

module.exports = router;
