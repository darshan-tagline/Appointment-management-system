const express = require("express");
const {
  getHearingRequests,
  updateHearingStatus,
} = require("../controller/doctorController");
const validate = require("../middleware/validateMiddleware");
const {
  hearingRequestUpdateValidatorSchema,
  hearingRequestValidatorSchema,
} = require("../validators/hearingRequestValidation");
const {
  getHearing,
  addHearingRequest,
} = require("../controller/patientController");

const hearingRequestRouter = express.Router();
const hearingRequestRouterForPatient = express.Router();

hearingRequestRouter.get("/", getHearingRequests);
hearingRequestRouter.put(
  "/:id",
  validate(hearingRequestUpdateValidatorSchema),
  updateHearingStatus
);

hearingRequestRouterForPatient.get("/", getHearing);
hearingRequestRouterForPatient.post(
  "/",
  validate(hearingRequestValidatorSchema),
  addHearingRequest
);

module.exports = { hearingRequestRouter, hearingRequestRouterForPatient };
