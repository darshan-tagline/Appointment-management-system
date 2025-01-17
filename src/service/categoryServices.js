const { Category } = require("../model/categoryModel");

const findCategoryByName = async (name) => {
  return Category.findOne({ name });
};

const addNewCategory = async (category) => {
  return Category.create(category);
};
const findAllcategories = async () => {
  return Category.find();
};
const searchCategoriesByname = async (name) => {
  return Category.find({ name: { $regex: name, $options: "i" } });
};

module.exports = {
  findCategoryByName,
  addNewCategory,
  findAllcategories,
  searchCategoriesByname,
};
