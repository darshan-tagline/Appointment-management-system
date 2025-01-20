const { findAdminByEmail } = require("../service/adminServices");
const { sendResponse } = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const { tokenGeneration } = require("../utils/token");
const {
  addNewCategory,
  findCategoryByName,
  findAllcategories,
  searchCategoriesByname,
  findCategoryById,
  removeCategory,
  modifyCategory,
} = require("../service/categoryServices");
const {
  findMedicineByName,
  addNewMedicine,
  findMedicineById,
  findAllMedicines,
  modifyMedicine,
  removeMedicine,
  searchMedicinesByname,
} = require("../service/medicineServices");
const {
  findDoctorByEmail,
  addDoctor,
  findAllDoctors,
  findDoctorById,
} = require("../service/doctorServices");
const { sendEmail } = require("../utils/sendMail");

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
    return sendResponse(res, 201, "Category created successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};
const getCategouryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategoryById(id);
    if (!category) {
      return sendResponse(res, 404, "Category not found");
    }
    return sendResponse(res, 200, "Category fetched successfully", category);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await findAllcategories();
    if (categories.length === 0) {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!name) {
      const categories = await findAllcategories(skip, limit);
      return sendResponse(res, 400, "All categories", categories);
    }
    const categories = await searchCategoriesByname(name);
    if (categories.length === 0) {
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
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const already = await findCategoryByName(name);
    if (already) {
      return sendResponse(res, 400, "Category already exists");
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
    console.error("Error updating category:", error.message);
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
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const addMedicine = async (req, res) => {
  try {
    const { name, price } = req.body;
    const already = await findMedicineByName(name);
    if (already) {
      return sendResponse(res, 400, "Medicine already exists");
    }
    const medicine = await addNewMedicine({ name, price });
    return sendResponse(res, 201, "Medicine created successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await findAllMedicines();
    console.log("hey");

    if (medicines.length === 0) {
      return sendResponse(res, 404, "Medicines not found");
    }
    return sendResponse(res, 200, "Medicines fetched successfully", medicines);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await findMedicineById(id);
    if (!medicine) {
      return sendResponse(res, 404, "Medicine not found");
    }
    return sendResponse(res, 200, "Medicine fetched successfully", medicine);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const already = await findMedicineByName(name);
    if (already) {
      return sendResponse(res, 400, "Medicine already exists");
    }
    const updatedMedicine = await modifyMedicine(id, {
      name,
      price,
    });

    if (!updatedMedicine) {
      return sendResponse(res, 404, "Medicine not found");
    }

    return sendResponse(
      res,
      200,
      "Medicine updated successfully",
      updatedMedicine
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await removeMedicine(id);
    if (!medicine) {
      return sendResponse(res, 404, "Medicine not found");
    }
    return sendResponse(res, 200, "Medicine deleted successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const searchMedicine = async (req, res) => {
  try {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!name) {
      const medicines = await findAllMedicines(skip, limit);
      return sendResponse(res, 400, "All medicines", medicines);
    }
    const medicines = await searchMedicinesByname(name);
    if (medicines.length === 0) {
      return sendResponse(res, 404, "Medicines not found");
    }
    return sendResponse(res, 200, "Medicines fetched successfully", medicines);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const createDoctor = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    const already = await findDoctorByEmail(email);
    const validCategory = await findCategoryById(category);
    if (!validCategory) {
      return sendResponse(res, 400, "Category not found");
    }
    if (already) {
      return sendResponse(res, 400, "Doctor already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      category,
    };

    const doctor = await addDoctor(doctorData);

    const subject = "Welcome to the System - Your Login Details";
    const textContent = `
      Dear Dr. ${name},

      Your account has been created.

      Email: ${email}
      Temporary Password: ${password}

      Please log in and change your password immediately.

      Best regards,
      Your System Team
    `;

    await sendEmail(email, subject, textContent);

    return sendResponse(res, 201, "Doctor created successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await findAllDoctors();
    if (doctors.length === 0) {
      return sendResponse(res, 404, "Doctors not found");
    }
    return sendResponse(res, 200, "Doctors fetched successfully", doctors);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await findDoctorById(id);
    if (!doctor) {
      return sendResponse(res, 404, "Doctor not found");
    }
    return sendResponse(res, 200, "Doctor fetched successfully", doctor);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateDoctor = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteDoctor = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const searchDoctors = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  adminLogin,

  addCtegory,
  getAllCategories,
  searchCategories,
  deleteCategory,
  updateCategory,
  getCategouryById,

  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  searchMedicine,

  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
};
