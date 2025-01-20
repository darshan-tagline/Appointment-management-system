const express = require("express");
const {
  doctorLogin,
  viewAndUpdateAppointment,
} = require("../controller/doctorController");
const authenticateToken = require("../middleware/authMiddleware");
const doctorRouter = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.put("/appoinment",authenticateToken,viewAndUpdateAppointment);

module.exports = doctorRouter;
