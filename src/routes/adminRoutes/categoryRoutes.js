const express = require("express");
const validate = require("../../middleware/validateMiddleware");
const categoryValidatorSchema = require("../../validators/categoryValidation");
const {
  addCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../../controller/adminControllers/categoryController');
const categoryRouter = express.Router();

categoryRouter.post("/", validate(categoryValidatorSchema), addCategory);
categoryRouter.get("/id/:id", getCategoryById);
categoryRouter.get("/:name?", getAllCategories);
categoryRouter.put("/:id", validate(categoryValidatorSchema), updateCategory);
categoryRouter.delete("/:id", deleteCategory);

module.exports = categoryRouter;
