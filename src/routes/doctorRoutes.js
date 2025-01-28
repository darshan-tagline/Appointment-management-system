const express = require("express");
const {
  updateAppointment,
  getAppointmentForDoctor,
  getCase,
  addHearing,
  updateHearing,
  getHearing,
  getHearingRequests,
  updateHearingStatus,
} = require("../controller/doctorController");
const validate = require("../middleware/validateMiddleware");
const {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} = require("../controller/doctorController");
const {
  hearingValidatorSchema,
  hearingUpdateValidatorSchema,
} = require("../validators/hearingValidation");
const {
  doctorValidatorSchema,
  doctorUpdateValidatorSchema,
} = require("../validators/doctorValidation");
const {
  appointmentUpdateValidatorSchema,
} = require("../validators/appoinmentValidation");
const {
  hearingRequestUpdateValidatorSchema,
} = require("../validators/hearingRequestValidation");

const adminDoctorRouter = express.Router();
const doctorRouter = express.Router();

adminDoctorRouter.post("/", validate(doctorValidatorSchema), createDoctor);
adminDoctorRouter.get("/", getAllDoctors);
adminDoctorRouter.get("/:id", getDoctorById);
adminDoctorRouter.put(
  "/:id",
  validate(doctorUpdateValidatorSchema),
  updateDoctor
);
adminDoctorRouter.delete("/:id", deleteDoctor);

// doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appoinment", getAppointmentForDoctor);
doctorRouter.put(
  "/appoinment/:id",
  validate(appointmentUpdateValidatorSchema),
  updateAppointment
);
doctorRouter.get("/case", getCase);
doctorRouter.get("/hearing/:id", getHearing);
doctorRouter.post(
  "/hearing",
  validate(hearingValidatorSchema),
  addHearing
);
doctorRouter.put(
  "/hearing/:id",
  validate(hearingUpdateValidatorSchema),
  updateHearing
);

doctorRouter.get("/hearingrequests", getHearingRequests);
doctorRouter.put(
  "/hearingrequest/:id",
  validate(hearingRequestUpdateValidatorSchema),
  updateHearingStatus
);

module.exports = { adminDoctorRouter, doctorRouter };
