const express = require("express");
const validate = require("../middleware/validateMiddleware");
const medicineValidatorSchema = require("../validators/medicineValidation");
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
medicineRouter.put("/:id", validate(medicineValidatorSchema), updateMedicine);
medicineRouter.delete("/:id", deleteMedicine);

module.exports = medicineRouter;
