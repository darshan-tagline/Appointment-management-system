const sendResponse = require("../../utils/responseUtils");
const { findCategoryById } = require("../../service/categoryServices");
const sendEmail = require("../../utils/sendMail");
const { passwordHash } = require("../../utils/passwordUtils");
const createDoctor = async (req, res) => {
  try {
    const { name, email, password, categoryId } = req.body;
    const alreadyExist = await findDoctor({ email });
    if (alreadyExist) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    const validCategory = await findCategoryById(categoryId);
    if (!validCategory) {
      return sendResponse(res, 400, "Category not found");
    }
    const hashedPassword = await passwordHash(password);
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      categoryId,
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
    const { name } = req.params;
    let doctors;
    if (name) {
      doctors = await findDoctor({ name });
      if (!doctors || doctors.length === 0) {
        return sendResponse(res, 404, "No doctors found with the given name");
      }
    } else {
      doctors = await findAllDoctors();
    }
    return sendResponse(
      res,
      200,
      name ? "Doctor fetched successfully" : "Doctors fetched successfully",
      doctors
    );
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
    const { id } = req.params;
    const { name, email, categoryId, password } = req.body;
    const validCategory = await findCategoryById(categoryId);
    if (!validCategory) {
      return sendResponse(res, 400, "Category not found");
    }
    const alreadyExist = await findDoctor({ email });
    if (alreadyExist) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    const hashedPassword = await passwordHash(password);
    const doctor = await modifyDoctor(id, {
      name,
      email,
      categoryId,
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

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
