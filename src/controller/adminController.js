const sendResponse = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const { tokenGeneration } = require("../utils/token");
const {
  addNewCategory,
  findAllcategories,
  findCategoryById,
  removeCategory,
  modifyCategory,
  findCategory,
  searchCategory,
} = require("../service/categoryServices");
const {
  addNewMedicine,
  findMedicineById,
  findAllMedicines,
  modifyMedicine,
  removeMedicine,
  searchMedicinesByname,
  findMedicine,
  searchMedicines,
} = require("../service/medicineServices");
const {
  findDoctor,
  addDoctor,
  findAllDoctors,
  findDoctorById,
  modifyDoctor,
  removeDoctor,
  searchDoctorByName,
  searchDoctor,
} = require("../service/doctorServices");
const sendEmail = require("../utils/sendMail");
const { default: mongoose } = require("mongoose");
const Doctor = require("../model/doctorModel");
const findAdmin = require("../service/adminServices");
const { passwordCompare, passwordHash } = require("../utils/passwordUtils");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdmin({ email });
    if (!admin) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const isPasswordMatch = await passwordCompare(password, admin.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = tokenGeneration(process.env.ADMIN_EMAIL);
    return sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const addCtegory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const already = await findCategory({ name });
    if (already) {
      return sendResponse(res, 400, "Category already exists");
    }
    await addNewCategory({ name, description });
    return sendResponse(res, 201, "Category created successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await findAllcategories();
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
    const { input } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let categories;

    if (mongoose.Types.ObjectId.isValid(input)) {
      const category = await findCategoryById(input);
      if (category) {
        categories = [category];
      } else {
        categories = [];
      }
    } else {
      categories = await searchCategory(input, skip, limit);
    }
    if (!categories || categories.length === 0) {
      return sendResponse(res, 404, "No categories found");
    }

    return sendResponse(
      res,
      200,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return sendResponse(res, 500, "Server error");
  }
};
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const already = await findCategory({ name });
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
    const already = await findMedicine({ name });
    if (already) {
      return sendResponse(res, 400, "Medicine already exists");
    }
    await addNewMedicine({ name, price });
    return sendResponse(res, 201, "Medicine created successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await findAllMedicines();
    if (medicines.length === 0) {
      return sendResponse(res, 404, "Medicines not found");
    }
    return sendResponse(res, 200, "Medicines fetched successfully", medicines);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const already = await findMedicine({ name });
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
    const { input } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let medicines;

    if (mongoose.Types.ObjectId.isValid(input)) {
      const medicine = await findMedicineById(input);
      if (medicine) {
        medicines = [medicine];
      } else {
        medicines = [];
      }
    } else {
      medicines = await searchMedicines(input, skip, limit);
    }

    if (!medicines || medicines.length === 0) {
      return sendResponse(res, 404, "No medicines found");
    }

    return sendResponse(res, 200, "Medicines fetched successfully", medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return sendResponse(res, 500, "Server error");
  }
};

const createDoctor = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    const already = await findDoctor({ email });
    const validCategory = await findCategoryById(category);
    if (!validCategory) {
      return sendResponse(res, 400, "Category not found");
    }
    if (already) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    const hashedPassword = await passwordHash(password);
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      category,
    };
    await addDoctor(doctorData);
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

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, category, password } = req.body;
    const validCategory = await findCategoryById(category);
    if (!validCategory) {
      return sendResponse(res, 400, "Category not found");
    }
    const already = await findDoctor({ email });
    if (already) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    const hashedPassword = await passwordHash(password);
    const doctor = await modifyDoctor(id, {
      name,
      email,
      category,
      password: hashedPassword,
    });
    if (!doctor) {
      return sendResponse(res, 404, "Doctor not found");
    }
    return sendResponse(res, 200, "Doctor updated successfully", doctor);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await removeDoctor(id);
    if (!doctor) {
      return sendResponse(res, 404, "Doctor not found");
    }
    return sendResponse(res, 200, "Doctor deleted successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const searchDoctors = async (req, res) => {
  try {
    const { input } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let doctors;

    if (mongoose.Types.ObjectId.isValid(input)) {
      const doctor = await findDoctorById(input);

      if (doctor) {
        doctors = [doctor];
      } else {
        doctors = [];
      }
    } else {
      doctors = await  searchDoctor(input, skip, limit);
    }

    if (!doctors || doctors.length === 0) {
      return sendResponse(res, 404, "No doctors found");
    }
    return sendResponse(res, 200, "Doctors fetched successfully", doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  adminLogin,

  //category
  addCtegory,
  getAllCategories,
  searchCategories,
  deleteCategory,
  updateCategory,

  //medicine
  addMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
  //doctor
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
};
