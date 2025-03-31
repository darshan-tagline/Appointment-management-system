const express = require("express");
const validate = require("../middleware/validateMiddleware");
const {
  categoryValidatorSchema,
  categoryUpdateValidatorSchema,
} = require("../validators/categoryValidation");
const {
  addCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const { idValidatorSchema } = require("../validators/commonValidation");
const categoryRouter = express.Router();

categoryRouter.post("/", validate(categoryValidatorSchema), addCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", validate(idValidatorSchema), getCategoryById);
categoryRouter.put(
  "/:id",
  validate(idValidatorSchema.concat(categoryUpdateValidatorSchema)),
  updateCategory
);
categoryRouter.delete("/:id", deleteCategory);

module.exports = categoryRouter;
