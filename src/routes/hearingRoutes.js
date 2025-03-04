const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  getHearing,
  updateHearing,
  addHearing,
} = require("../controller/hearingController");
const {
  hearingUpdateValidatorSchema,
  hearingValidatorSchema,
} = require("../validators/hearingValidation");

const hearingRouter = express.Router();

hearingRouter.post("/", validate(hearingValidatorSchema),addHearing);
hearingRouter.get("/:id", getHearing);
hearingRouter.put(
  "/:id",
  validate(hearingUpdateValidatorSchema),
  updateHearing
);

module.exports = hearingRouter;
