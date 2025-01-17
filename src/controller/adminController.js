const { findAdminByEmail } = require("../service/adminServices");
const { sendResponse } = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const { tokenGeneration } = require("../utils/token");
const {
  addNewCategory,
  findCategoryByName,
  findAllcategories,
  searchCategoriesByname,
} = require("../service/categoryServices");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = tokenGeneration(admin._id);
    return sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const addCtegory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const already = await findCategoryByName(name);
    if (already) {
      return sendResponse(res, 400, "Category already exists");
    }
    const category = await addNewCategory({ name, description });
    await category.save();
    return sendResponse(res, 201, "Category created successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await findAllcategories();
    if (!categories) {
      return sendResponse(res, 404, "Categories not found");
    }
    return sendResponse(
      res,
      200,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const searchCategories = async (req, res) => {
  try {
    const { name } = req.params;
    const categories = await searchCategoriesByname(name);
    if (!categories) {
      return sendResponse(res, 404, "Categories not found");
    }
    return sendResponse(
      res,
      200,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};
module.exports = { adminLogin, addCtegory, getAllCategories, searchCategories };
