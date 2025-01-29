const Category = require("../model/categoryModel");

const findCategory = async (data) => {
  try {
    return Category.findOne(data);
  } catch (error) {
    console.log("error in finding category", error);
    return null;
  }
};

const addNewCategory = async (category) => {
  try {
    return Category.create(category);
  } catch (error) {
    console.log("error in adding category", error);
    return null;
  }
};
const removeCategory = async (id) => {
  try {
    return Category.findByIdAndDelete(id);
  } catch (error) {
    console.log("error in removing category", error);
    return null;
  }
};
const modifyCategory = async (id, category) => {
  try {
    return Category.findByIdAndUpdate(id, category, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.log("error in modifying category", error);
    return null;
  }
};

const searchCategory = async (data) => {
  try {
    const query = {};
    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 10;
    const skip = (page - 1) * limit;
    data.name && (query.name = { $regex: data.name, $options: "i" });
    data.description &&
      (query.description = { $regex: data.description, $options: "i" });
    return Category.aggregate([
      {
        $match: query,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  } catch (error) {
    console.log("error in searching category", error);
    return null;
  }
};

module.exports = {
  findCategory,
  addNewCategory,
  removeCategory,
  modifyCategory,
  searchCategory,
};
