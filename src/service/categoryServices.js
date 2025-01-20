const  Category  = require("../model/categoryModel");

const findCategoryByName = async (name) => {
  return Category.findOne({ name });
};
const addNewCategory = async (category) => {
  return Category.create(category);
};
const findAllcategories = async () => {
  return Category.find();
};

const searchCategoriesByname = async (name, skip, limit) => {
  return Category.find({
    name: {
      $regex: `^${name}`,
      $options: "i",
    },
  })
    .skip(skip)
    .limit(limit);
};
const findCategoryById = async (id) => {
  return Category.findById(id);
};
const removeCategory = async (id) => {
  return Category.findByIdAndDelete(id);
};
const modifyCategory = async (id, category) => {
  const { name, description } = category;

  return Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true }
  );
};

module.exports = {
  findCategoryByName,
  addNewCategory,
  findAllcategories,
  searchCategoriesByname,
  findCategoryById,
  removeCategory,
  modifyCategory,
};
