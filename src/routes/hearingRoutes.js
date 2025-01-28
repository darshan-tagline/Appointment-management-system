const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  getHearing,
  updateHearing,
  addHearing,
} = require("../controller/doctorController");
const {
  hearingUpdateValidatorSchema,
} = require("../validators/hearingValidation");

const hearingRouter = express.Router();

hearingRouter.post("/", addHearing);
hearingRouter.get("/:id", getHearing);
hearingRouter.put(
  "/:id",
  validate(hearingUpdateValidatorSchema),
  updateHearing
);

module.exports = hearingRouter;
