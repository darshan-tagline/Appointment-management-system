const express = require("express");
const {
  getHearingRequests,
  updateHearingStatus,
  getAllHearingRequests,
} = require("../controller/hearingRequestController");
const validate = require("../middleware/validateMiddleware");
const {
  hearingRequestUpdateValidatorSchema,
  hearingRequestValidatorSchema,
} = require("../validators/hearingRequestValidation");
const {
  getHearing,
  addHearingRequest,
} = require("../controller/hearingRequestController");

const hearingRequestRouter = express.Router();
const hearingRequestRouterForPatient = express.Router();
const hearingRequestRouterForAdmin = express.Router();

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

hearingRequestRouterForAdmin.get("/", getAllHearingRequests);
module.exports = {
  hearingRequestRouter,
  hearingRequestRouterForPatient,
  hearingRequestRouterForAdmin,
};
