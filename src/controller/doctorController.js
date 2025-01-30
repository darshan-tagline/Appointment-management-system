const { findCategory } = require("../service/categoryServices");
const { passwordHash } = require("../utils/passwordUtils");
const sendResponse = require("../utils/responseUtils");
const sendEmail = require("../utils/sendMail");
const {
  addNewUser,
  findUser,
  searchUser,
  updateUser,
  removeUser,
} = require("../service/userServices");
const { subject, mailText, role } = require("../utils/comman");

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
      role: role.DOCTOR,
      categoryId,
    });

    const textContent = mailText.DOCTOR.replace("${name}", name)
      .replace("${email}", email)
      .replace("${password}", password);

    await sendEmail(email, subject.DOCTOR, textContent);

    return sendResponse(res, 201, "Doctor created successfully");
  } catch (error) {
    console.log("Error in create doctor:>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const queryParams = req.query;
    let doctors = await searchUser("doctor", queryParams);
    if (doctors.length === 0) {
      return sendResponse(res, 404, "No doctors found with the given name");
    }
    return sendResponse(res, 200, "Doctors fetched successfully", {
      pagination: {
        page: Number(queryParams.page) || 1,
        limit: Number(queryParams.limit) || 10,
        totalDocuments: doctors.length,
        totalPages: Math.ceil(doctors.length / Number(queryParams.limit)) || 1,
      },
      doctors,
    });
  } catch (error) {
    console.log("Error in get all doctors:>>>>", error);
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
    console.log("Error in get doctor by id:>>>>", error);
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
      if (alreadyExist) {
        return sendResponse(
          res,
          400,
          "A doctor with this email already exists"
        );
      }
    }
    if (password) {
      newPassword = passwordHash(password);
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
    console.log("Error in update doctor:>>>>", error);
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
    console.log("Error in delete doctor:>>>>", error);
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
