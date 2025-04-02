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
  const result = await Category.aggregate([
    {
      $match: {
        ...(data.search && {
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { description: { $regex: data.search, $options: "i" } },
          ],
        }),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        metadata: [{ $count: "totalDocuments" }],
        categories: [{ $skip: skip }, { $limit: limit }],
      },
    },
    {
      $project: {
        totalDocuments: { $arrayElemAt: ["$metadata.totalDocuments", 0] },
        categories: 1,
      },
    },
  ]);
  const totalDocuments = result[0]?.totalDocuments || 0;
  const totalPages = Math.ceil(totalDocuments / limit);
  return {
    pagination: {
      page,
      limit,
      totalDocuments,
      totalPages,
    },
    categories: result[0]?.categories || [],
  };
};

module.exports = {
  findCategory,
  addNewCategory,
  removeCategory,
  modifyCategory,
  searchCategory,
};
