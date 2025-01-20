const express = require("express");
const {
  adminLogin,
  addCtegory,
  getAllCategories,
  getCategouryById,
  deleteCategory,
  updateCategory,
  searchCategories,
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
  createDoctor,
  getAllDoctors,
  getDoctorById,
} = require("../controller/adminController");
const {
  validateAdmin,
  authenticateToken,
} = require("../middleware/adminMiddleware");
const { validateCategory } = require("../middleware/categoryMiddleware");
const { validateMedicine } = require("../middleware/medicineMiddleware");
const { addDoctor } = require("../service/doctorServices");
const { validateDoctor } = require("../middleware/doctorMiddleware");
const { get } = require("mongoose");

const adminRouter = express.Router();

//Login
adminRouter.post("/login", validateAdmin, adminLogin);

//Category
adminRouter.post("/category", validateCategory, authenticateToken, addCtegory);
adminRouter.get("/category", authenticateToken, getAllCategories);
adminRouter.get("/category/:id", authenticateToken, getCategouryById);
adminRouter.put(
  "/category/:id",
  validateCategory,
  authenticateToken,
  updateCategory
);
adminRouter.delete("/category/:id", authenticateToken, deleteCategory);
adminRouter.get("/category/search/:name", authenticateToken, searchCategories);

//Medicine
adminRouter.post("/medicine", authenticateToken, validateMedicine, addMedicine);
adminRouter.get("/medicine", authenticateToken, getAllMedicines);
adminRouter.get("/medicine/:id", authenticateToken, getMedicineById);
adminRouter.put(
  "/medicine/:id",
  validateMedicine,
  authenticateToken,
  updateMedicine
);
adminRouter.delete("/medicine/:id", authenticateToken, deleteMedicine);
adminRouter.get("/medicine/search/:name", authenticateToken, searchMedicine);

//Doctor

adminRouter.post("/doctor", authenticateToken, validateDoctor, createDoctor);
adminRouter.get("/doctor", authenticateToken, getAllDoctors);
adminRouter.get("/doctor/:id", authenticateToken, getDoctorById);
module.exports = { adminRouter };
