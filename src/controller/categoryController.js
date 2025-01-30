const sendResponse = require("../utils/responseUtils");
const {
  addNewCategory,
  removeCategory,
  modifyCategory,
  findCategory,
  searchCategory,
} = require("../service/categoryServices");

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const alreadyExist = await findCategory({ name });
    if (alreadyExist) {
      return sendResponse(res, 400, "Category already exists");
    }
    await addNewCategory({ name, description });
    return sendResponse(res, 201, "Category created successfully");
  } catch (error) {
    console.log("Error in add category:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllCategories = async (req, res) => {
  try {
    const queryParams = req.query;
    let categories = await searchCategory(queryParams);

    if (categories.length === 0) {
      return sendResponse(res, 404, "No categories found with the given name");
    }
    return sendResponse(res, 200, "Categories fetched successfully", {
      pagination: {
        page: Number(queryParams.page) || 1,
        limit: Number(queryParams.limit) || 10,
        totalDocuments: categories.length,
        totalPages:
          Math.ceil(categories.length / Number(queryParams.limit)) || 1,
      },
      categories,
    });
  } catch (error) {
    console.log("Error in get all categories:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategory({ _id: id });
    if (!category) {
      return sendResponse(res, 404, "Category not found");
    }
    return sendResponse(res, 200, "Category fetched successfully", category);
  } catch (error) {
    console.log("Error in get category by id:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const alreadyExist = await findCategory({ name });
    if (alreadyExist) {
      return sendResponse(res, 400, "Category name already exists");
    }
    const updatedCategory = await modifyCategory(id, {
      name,
      description,
    });

    if (!updatedCategory) {
      return sendResponse(res, 404, "Category not found");
    }

    return sendResponse(
      res,
      200,
      "Category updated successfully",
      updatedCategory
    );
  } catch (error) {
    console.error("Error updating category:>>>>>", error.message);
    return sendResponse(res, 500, "Server error");
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await removeCategory(id);
    if (!category) {
      return sendResponse(res, 404, "Category not found");
    }
    return sendResponse(res, 200, "Category deleted successfully");
  } catch (error) {
    console.log("Error in delete category:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
};
