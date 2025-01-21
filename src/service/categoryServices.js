const Category = require("../model/categoryModel");

const findCategory = async (data) => {
  return Category.findOne(data);
};
const findAllcategories = async () => {
  return Category.find();
};
const searchCategory = async (data, skip, limit) => {
  return Category.find({
    $or: [
      { name: { $regex: data, $options: "i" } },
      { description: { $regex: data, $options: "i" } },
    ],
  })
    .skip(skip)
    .limit(limit);
};

const findCategoryById = async (id) => {
  return Category.findById(id);
};
const addNewCategory = async (category) => {
  return Category.create(category);
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
  findCategory,
  addNewCategory,
  findAllcategories,
  searchCategory,
  findCategoryById,
  removeCategory,
  modifyCategory,
};
