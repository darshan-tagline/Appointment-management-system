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

const medicineRouter = express.Router();

medicineRouter.post("/", validate(medicineValidatorSchema), addMedicine);
medicineRouter.get("/", getAllMedicines);
medicineRouter.get("/:id", getMedicineById);
medicineRouter.put(
  "/:id",
  validate(medicineUpdateValidatorSchema),
  updateMedicine
);
medicineRouter.delete("/:id", deleteMedicine);

module.exports = medicineRouter;
