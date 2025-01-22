const express = require("express");
const {
  doctorLogin,
  updateAppointment,
  getAppointmentForDoctor,
  getCase,
  addHearing,
  updateHearing,
  getHearing,
} = require("../controller/doctorController");
const authorizeDoctor = require("../middleware/doctorMiddleware");
const validate = require("../middleware/validateMiddleware");
const hearingValidatorSchema = require("../validators/hearingValidation");

const doctorRouter = express.Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appoinment", authorizeDoctor, getAppointmentForDoctor);
doctorRouter.put("/appoinment/:id", authorizeDoctor, updateAppointment);
doctorRouter.get("/case", authorizeDoctor, getCase);
doctorRouter.get("/hearing/:id", authorizeDoctor, getHearing);
doctorRouter.post(
  "/hearing",
  authorizeDoctor,
  validate(hearingValidatorSchema),
  addHearing
);
doctorRouter.put(
  "/hearing/:id",
  authorizeDoctor,
  updateHearing
);

module.exports = doctorRouter;
