const { findCategory } = require("../service/categoryServices");
const { passwordHash } = require("../utils/passwordUtils");
const {
  findDoctor,
  addDoctor,
  modifyDoctor,
  removeDoctor,
  searchDoctor,
} = require("../service/doctorServices");
const sendResponse = require("../utils/responseUtils");
const { tokenGeneration } = require("../utils/token");
const {
  updateStatus,
  findAppointment,
} = require("../service/appoinmentServices");
const {
  addNewCase,
  findCasesByDoctor,
  findCase,
} = require("../service/caseServices");
const { passwordCompare } = require("../utils/passwordUtils");
const {
  addNewHearing,
  findHearing,
  updateHearingData,
} = require("../service/hearingServices");
const { createBill, findBill } = require("../service/billServices");
const sendEmail = require("../utils/sendMail");
const { findMedicine } = require("../service/medicineServices");

const createDoctor = async (req, res) => {
  try {
    const { name, email, password, categoryId } = req.body;
    const alreadyExist = await findDoctor({ email });
    if (alreadyExist) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    const validCategory = await findCategory({ _id: categoryId });
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
    const queryParams = req.query;
    let doctors;

    doctors = await searchDoctor(queryParams);
    if (doctors.length === 0) {
      return sendResponse(res, 404, "No doctors found with the given name");
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
    const doctor = await findDoctor({ _id: id });
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
    let newPassword = null;
    const { id } = req.params;
    const { name, email, categoryId, password } = req.body;
    const doctorData = await findDoctor({ _id: id });
    if (!doctorData) {
      return sendResponse(res, 404, "Doctor not found");
    }
    if (categoryId) {
      const validCategory = await findCategory({ _id: categoryId });
      if (!validCategory) {
        return sendResponse(res, 400, "Category not found");
      }
    }
    const alreadyExist = await findDoctor({ email });
    if (alreadyExist && alreadyExist._id.toString() !== id) {
      return sendResponse(res, 400, "Doctor already exists");
    }
    if (password) {
      newPassword = await passwordHash(password);
    }

    const doctor = await modifyDoctor(id, {
      name,
      email,
      categoryId,
      password: newPassword ? newPassword : doctorData.password,
    });
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

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await findDoctor({ email });
    if (!doctor) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const isPasswordMatch = await passwordCompare(password, doctor.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = tokenGeneration(doctor._id);
    return sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAppointmentForDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await findAppointment({ doctorId });
    if (!appointments || appointments.length === 0) {
      return sendResponse(res, 404, "No appointments found.");
    }
    return sendResponse(
      res,
      200,
      "Appointments fetched successfully",
      appointments
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await updateStatus(id, status);
    if (!appointment) {
      return sendResponse(res, 404, "Appointment not found");
    }
    if (status === "rejected") {
      return sendResponse(res, 200, "Appointment is rejected", appointment);
    }
    const existingCase = await findCase({ appointmentId: id });
    if (existingCase) {
      return sendResponse(
        res,
        400,
        "Appointment already exists for this appointment and this appointment is already approved"
      );
    }
    const newCase = {
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
    };

    const caseCreated = await addNewCase(newCase);

    return sendResponse(
      res,
      200,
      "Appointment updated successfully and case created",
      { appointment, caseCreated }
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};
const getCase = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const data = await findCasesByDoctor({ doctorId });
    if (!data) {
      return sendResponse(res, 404, "Case not found");
    }
    return sendResponse(res, 200, "Case fetched successfully", data);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const addHearing = async (req, res) => {
  try {
    const { caseId, description, prescription } = req.body;
    const validCase = await findCase({ _id: caseId });
    if (!validCase) {
      return sendResponse(res, 400, `case does not exist in the database.`);
    }

    const existingCase = await findHearing({ caseId });
    if (existingCase) {
      return sendResponse(
        res,
        400,
        "Hearing for this case already exists in the database."
      );
    }
    for (let i = 0; i < prescription.length; i++) {
      const medicine = prescription[i];
      const validMedicine = await findMedicine({ _id: medicine.medicineId });
      if (!validMedicine) {
        return sendResponse(
          res,
          400,
          `Medicine does not exist in the database.`
        );
      }
    }
    const newHearing = await addNewHearing({
      caseId,
      description,
      prescription,
    });

    return sendResponse(res, 201, "Hearing added successfully", newHearing);
  } catch (error) {
    console.error("Error adding hearing:", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await findHearing({ _id: id });
    if (!data) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", data);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hearing = await updateHearingData(id, status);

    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }
    if (hearing.status === "resolved") {
      const existingBill = await findBill({ hearingId: id });

      if (existingBill) {
        return sendResponse(
          res,
          400,
          "Hearing already resolved and bill exists"
        );
      }
      const caseId = hearing.caseId._id;
      const totalAmount = await calculateTotalAmount(hearing);

      const bill = await createBill(caseId, hearing._id, totalAmount);

      return sendResponse(res, 200, "Hearing updated and bill created", {
        hearing,
        bill,
      });
    }
    return sendResponse(res, 200, "Hearing updated successfully", hearing);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const calculateTotalAmount = async (hearing) => {
  try {
    const doctorFee = 100;
    let totalMedicineCost = 0;
    for (let i = 0; i < hearing.prescription.length; i++) {
      const medicine = hearing.prescription[i];

      const medicineDetails = await findMedicine(medicine.medicineId);

      if (!medicineDetails) {
        throw new Error(`Medicine not found`);
      }

      totalMedicineCost += medicineDetails.price;
    }

    const totalAmount = totalMedicineCost + doctorFee;

    return totalAmount;
  } catch (error) {
    console.error("Error ", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
  updateAppointment,
  getAppointmentForDoctor,
  getCase,
  getHearing,
  addHearing,
  updateHearing,
};
