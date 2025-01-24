const express = require("express");
const validate = require("../../middleware/validateMiddleware");
const medicineValidatorSchema = require("../../validators/medicineValidation");
const {
  addMedicine,
  getMedicineById,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} = require('../../controller/adminControllers/medicineController');

const medicineRouter = express.Router();

medicineRouter.post("/", validate(medicineValidatorSchema), addMedicine);
medicineRouter.get("/id/:id", getMedicineById);
medicineRouter.get("/:name?", getAllMedicines);
medicineRouter.put("/:id", validate(medicineValidatorSchema), updateMedicine);
medicineRouter.delete("/:id", deleteMedicine);

module.exports = medicineRouter;
