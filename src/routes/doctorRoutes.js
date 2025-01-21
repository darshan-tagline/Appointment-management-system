const express = require("express");
const {
  doctorLogin,
  viewAndUpdateAppointment,
} = require("../controller/doctorController");
const authorizeDoctor = require("../middleware/doctorMiddleware");

const doctorRouter = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.put("/appoinment", authorizeDoctor, viewAndUpdateAppointment);

module.exports = doctorRouter;
