const express = require("express");
const validate = require("../middleware/validateMiddleware");
const categoryValidatorSchema = require("../validators/categoryValidation");
const {
  addCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const categoryRouter = express.Router();

categoryRouter.post("/", validate(categoryValidatorSchema), addCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

module.exports = categoryRouter;
