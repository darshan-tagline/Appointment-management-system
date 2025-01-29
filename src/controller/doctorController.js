const { findCategory } = require("../service/categoryServices");
const { passwordHash } = require("../utils/passwordUtils");
const sendResponse = require("../utils/responseUtils");
const sendEmail = require("../utils/sendMail");
const { findMedicine } = require("../service/medicineServices");
const {
  addNewUser,
  findUser,
  searchUser,
  updateUser,
  removeUser,
} = require("../service/userServices");

const createDoctor = async (req, res) => {
  try {
    const { name, email, password, categoryId } = req.body;
    const alreadyExist = await findUser({
      email,
    });
    if (alreadyExist) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    const validCategory = await findCategory({ _id: categoryId });
    if (!validCategory) {
      return sendResponse(res, 400, "Category not found");
    }
    const hashedPassword = await passwordHash(password);
    await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      categoryId,
    });
    const subject = "Welcome to the System - Your Login Details";
    const textContent = `
      Dear Dr. ${name},

      Your account has been created.

      Email: ${email}
      Password: ${password}

      Best regards,
      Your System Team
    `;

    await sendEmail(email, subject, textContent);

    return sendResponse(res, 201, "Doctor created successfully");
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const queryParams = req.query;
    let doctors;

    doctors = await searchUser("doctor", queryParams);
    if (doctors.length === 0) {
      return sendResponse(res, 404, "No doctors found with the given name");
    }
    return sendResponse(res, 200, "Doctors fetched successfully", doctors);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await findUser({ _id: id, role: "doctor" });
    if (!doctor) {
      return sendResponse(res, 404, "Doctor not found");
    }
    return sendResponse(res, 200, "Doctor fetched successfully", doctor);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};
const updateDoctor = async (req, res) => {
  try {
    let newPassword = null;
    const { id } = req.params;
    const { name, email, categoryId, password } = req.body;
    const doctorData = await findUser({ _id: id, role: "doctor" });
    if (!doctorData) {
      return sendResponse(res, 404, "Doctor not found");
    }
    if (categoryId) {
      const validCategory = await findCategory({ _id: categoryId });
      if (!validCategory) {
        return sendResponse(res, 400, "Category not found");
      }
    }
    if (email !== doctorData.email) {
      const alreadyExist = await findUser({ email, role: "doctor" });
      if (alreadyExist && alreadyExist._id.toString() !== id) {
        return sendResponse(
          res,
          400,
          "A doctor with this email already exists"
        );
      }
    }
    if (password) {
      newPassword = await passwordHash(password);
    }

    const doctor = await updateUser(
      { _id: id, role: "doctor" },
      {
        name,
        email,
        categoryId,
        password: newPassword ? newPassword : doctorData.password,
      }
    );
    
    return sendResponse(res, 200, "Doctor updated successfully", doctor);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await removeUser({ _id: id, role: "doctor" });
    if (!doctor) {
      return sendResponse(res, 404, "Doctor not found");
    }
    return sendResponse(res, 200, "Doctor deleted successfully");
  } catch (error) {
    console.log("Server Error", error);
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
