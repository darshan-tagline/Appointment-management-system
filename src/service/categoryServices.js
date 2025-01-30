const Category = require("../model/categoryModel");

const findCategory = async (data) => {
  return Category.findOne(data);
};

const addNewCategory = async (category) => {
  return Category.create(category);
};
const removeCategory = async (id) => {
  return Category.findByIdAndDelete(id);
};
const modifyCategory = async (id, category) => {
  return Category.findByIdAndUpdate(id, category, {
    new: true,
    runValidators: true,
  });
};

const searchCategory = async (data) => {
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;
  return Category.aggregate([
    {
      $match: {
        ...(data.name && { name: { $regex: data.name, $options: "i" } }),
        ...(data.description && {
          description: { $regex: data.description, $options: "i" },
        }),
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
};

module.exports = {
  findCategory,
  addNewCategory,
  removeCategory,
  modifyCategory,
  searchCategory,
};
