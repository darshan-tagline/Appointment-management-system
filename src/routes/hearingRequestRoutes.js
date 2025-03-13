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
const { idValidatorSchema } = require("../validators/commonValidation");

const hearingRequestRouter = express.Router();
const hearingRequestRouterForPatient = express.Router();
const hearingRequestRouterForAdmin = express.Router();

//doctor 
hearingRequestRouter.get("/", getHearingRequests);
hearingRequestRouter.put(
  "/:id",
  validate(idValidatorSchema.concat(hearingRequestUpdateValidatorSchema)),
  updateHearingStatus
);

// patient
hearingRequestRouterForPatient.get("/", getHearing);
hearingRequestRouterForPatient.post(
  "/",
  validate(hearingRequestValidatorSchema),
  addHearingRequest
);


// admin
hearingRequestRouterForAdmin.get("/", getAllHearingRequests);
hearingRequestRouterForAdmin.put(
  "/:id",
  validate(idValidatorSchema.concat(hearingRequestUpdateValidatorSchema)),
  updateHearingStatus
);
module.exports = {
  hearingRequestRouter,
  hearingRequestRouterForPatient,
  hearingRequestRouterForAdmin,
};
