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
const { idValidatorSchema } = require("../validators/commonValidation");

const hearingRouter = express.Router();
const hearingRouterForAdmin = express.Router();

// doctor
hearingRouter.post("/", validate(hearingValidatorSchema), addHearing);
hearingRouter.get("/:id", validate(idValidatorSchema), getHearing);
hearingRouter.put(
  "/:id",
  validate(idValidatorSchema.concat(hearingUpdateValidatorSchema)),
  updateHearing
);

// admin
hearingRouterForAdmin.get("/", getAllHearings);
hearingRouterForAdmin.get("/:id", validate(idValidatorSchema), getHearingById);
hearingRouterForAdmin.put(
  "/:id",
  validate(idValidatorSchema.concat(hearingUpdateValidatorSchema)),
  updateHearing
);

hearingRouterForAdmin.delete(
  "/:id",
  validate(idValidatorSchema),
  deleteHearing
);
module.exports = {
  hearingRouter,
  hearingRouterForAdmin,
};
