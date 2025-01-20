const express = require("express");
const { adminRouter } = require("./adminRoutes");
const router = express.Router();

router.use("/admin", adminRouter);

module.exports = router;
