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
const {
  validateAdmin,
  authorizeAdmin,
} = require("../middleware/adminMiddleware");
const validateCategory = require("../middleware/categoryMiddleware");
const validateMedicine = require("../middleware/medicineMiddleware");
const validateDoctor = require("../middleware/doctorMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const validatee = require("../middleware/validateMiddleware");

const adminRouter = express.Router();

//Login
adminRouter.post("/login", validatee(validateAdmin), adminLogin);

//Category
adminRouter.post(
  "/category",
  validateCategory,
  authenticateToken,
  authorizeAdmin,
  addCtegory
);
adminRouter.get(
  "/category",
  authenticateToken,
  authorizeAdmin,
  getAllCategories
);
adminRouter.put(
  "/category/:id",
  validateCategory,
  authenticateToken,
  authorizeAdmin,
  updateCategory
);
adminRouter.delete(
  "/category/:id",
  authenticateToken,
  authorizeAdmin,
  deleteCategory
);
adminRouter.get(
  "/category/search/:input",
  authenticateToken,
  authorizeAdmin,
  searchCategories
);

//Medicine
adminRouter.post(
  "/medicine",
  authenticateToken,
  authorizeAdmin,
  validateMedicine,
  addMedicine
);
adminRouter.get(
  "/medicine",
  authenticateToken,
  authorizeAdmin,
  getAllMedicines
);
adminRouter.put(
  "/medicine/:id",
  validateMedicine,
  authenticateToken,
  authorizeAdmin,
  updateMedicine
);
adminRouter.delete(
  "/medicine/:id",
  authenticateToken,
  authorizeAdmin,
  deleteMedicine
);
adminRouter.get(
  "/medicine/search/:input",
  authenticateToken,
  authorizeAdmin,
  searchMedicine
);

//Doctor

adminRouter.post(
  "/doctor",
  authenticateToken,
  authorizeAdmin,
  validateDoctor,
  createDoctor
);
adminRouter.get("/doctor", authenticateToken, authorizeAdmin, getAllDoctors);
adminRouter.put(
  "/doctor/:id",
  authenticateToken,
  authorizeAdmin,
  validateDoctor,
  updateDoctor
);
adminRouter.delete(
  "/doctor/:id",
  authenticateToken,
  authorizeAdmin,
  deleteDoctor
);
adminRouter.get(
  "/doctor/search/:input",
  authenticateToken,
  authorizeAdmin,
  searchDoctors
);

module.exports = adminRouter;
