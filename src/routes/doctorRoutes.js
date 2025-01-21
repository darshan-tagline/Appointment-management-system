const express = require("express");
const {
  doctorLogin,
  updateAppointment,
  getappoinment,
} = require("../controller/doctorController");
const authorizeDoctor = require("../middleware/doctorMiddleware");

const doctorRouter = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appoinment", getappoinment);
doctorRouter.put("/appoinment/:id", updateAppointment);

module.exports = doctorRouter;
