const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  getHearing,
  updateHearing,
  addHearing,
  getAllHearings,
  getHearingById,
  deleteHearing,
} = require("../controller/hearingController");
const {
  hearingUpdateValidatorSchema,
  hearingValidatorSchema,
} = require("../validators/hearingValidation");

const hearingRouter = express.Router();
const hearingRouterForAdmin = express.Router();

// doctor
hearingRouter.post("/", validate(hearingValidatorSchema), addHearing);
hearingRouter.get("/:id", getHearing);
hearingRouter.put(
  "/:id",
  validate(hearingUpdateValidatorSchema),
  updateHearing
);

// admin
hearingRouterForAdmin.get("/", getAllHearings);
hearingRouterForAdmin.get("/:id", getHearingById);
hearingRouterForAdmin.put(
  "/:id",
  validate(hearingUpdateValidatorSchema),
  updateHearing
);

hearingRouterForAdmin.delete("/:id", deleteHearing);
module.exports = {
  hearingRouter,
  hearingRouterForAdmin,
};
