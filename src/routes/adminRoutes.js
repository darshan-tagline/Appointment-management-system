const express = require("express");
const {
  adminLogin,
  addCtegory,
  getAllCategories,
} = require("../controller/adminController");
const {
  validateAdmin,
  authenticateToken,
} = require("../middleware/adminMiddleware");
const { validateCategory } = require("../middleware/categoryMiddleware");
const adminRouter = express.Router();

adminRouter.post("/login", validateAdmin, adminLogin);
adminRouter.post("/category", validateCategory, authenticateToken, addCtegory);
adminRouter.get("/category", authenticateToken, getAllCategories);

module.exports = { adminRouter };
