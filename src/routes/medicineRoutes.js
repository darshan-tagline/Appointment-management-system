const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  medicineValidatorSchema,
  medicineUpdateValidatorSchema,
} = require("../validators/medicineValidation");
const {
  addMedicine,
  getMedicineById,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controller/medicineController");
const { idValidatorSchema } = require("../validators/commonValidation");

const medicineRouter = express.Router();

medicineRouter.post("/", validate(medicineValidatorSchema), addMedicine);
medicineRouter.get("/", getAllMedicines);
medicineRouter.get("/:id", validate(idValidatorSchema), getMedicineById);
medicineRouter.put(
  "/:id",
  validate(idValidatorSchema.concat(medicineUpdateValidatorSchema)),
  updateMedicine
);
medicineRouter.delete("/:id", validate(idValidatorSchema), deleteMedicine);

module.exports = medicineRouter;
