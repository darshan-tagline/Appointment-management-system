const express = require("express");
const adminRouter = require("./adminRoutes");
const { doctorRouter } = require("./doctorRoutes");
const patientRouter = require("./patient");
const login = require("../utils/loginUtils");
const authorize = require("../middleware/authorizeMiddleware");
const router = express.Router();

router.post("/login", login);
router.use("/admin", authorize("admin"), adminRouter);
router.use("/doctor", authorize("doctor"), doctorRouter);
router.use("/patient", patientRouter);

module.exports = router;
