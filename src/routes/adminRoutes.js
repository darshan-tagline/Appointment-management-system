const express = require("express");
const {
  adminLogin,
  addCtegory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  searchCategories,
  addMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
} = require("../controller/adminController");
const authorize = require("../middleware/adminMiddleware");
const validate = require("../middleware/validateMiddleware");
const adminvalidatorSchema = require("../validators/adminValidation");
const categoryValidatorSchema = require("../validators/categoryValidation");
const medicineValidatorSchema = require("../validators/medicineValidation");
const doctorValidatorSchema = require("../validators/doctorValidation");

const adminRouter = express.Router();

//Login
adminRouter.post("/login", validate(adminvalidatorSchema), adminLogin);

//Category
adminRouter.post(
  "/category",
  validate(categoryValidatorSchema),
  authorize,
  addCtegory
);
adminRouter.get("/category", authorize, getAllCategories);
adminRouter.put(
  "/category/:id",
  authorize,
  validate(categoryValidatorSchema),
  updateCategory
);
adminRouter.delete("/category/:id", authorize, deleteCategory);
adminRouter.get("/category/search/:input", authorize, searchCategories);

//Medicine
adminRouter.post(
  "/medicine",
  authorize,
  validate(medicineValidatorSchema),
  addMedicine
);
adminRouter.get("/medicine", authorize, getAllMedicines);
adminRouter.put(
  "/medicine/:id",
  authorize,
  validate(medicineValidatorSchema),
  updateMedicine
);
adminRouter.delete("/medicine/:id", authorize, deleteMedicine);
adminRouter.get("/medicine/search/:input", authorize, searchMedicine);

//Doctor

adminRouter.post(
  "/doctor",
  authorize,
  validate(doctorValidatorSchema),
  createDoctor
);
adminRouter.get("/doctor", getAllDoctors);
adminRouter.put(
  "/doctor/:id",
  authorize,
  validate(doctorValidatorSchema),
  updateDoctor
);
adminRouter.get("/doctor/search/:input", authorize, searchDoctors);
adminRouter.delete("/doctor/:id", authorize, deleteDoctor);

module.exports = adminRouter;
