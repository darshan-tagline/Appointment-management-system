const { findDoctorByEmail } = require("../service/doctorServices");
const sendResponse = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenGeneration } = require("../utils/token");
const {
  updateStatus,
  findAppointmentByDoctorId,
} = require("../service/appoinmentServices");
const { addNewCase } = require("../service/caseServices");

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await findDoctorByEmail(email);
    if (!doctor) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password, doctor.password);
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

const viewAndUpdateAppointment = async (req, res) => {
  try {
    const { status } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const { id } = jwt.decode(token, process.env.JWT_SECRET);
    const appointment = await updateStatus(id, status);

    if (!appointment) {
      return sendResponse(res, 404, "Appointment not found or already updated");
    }

    if (status === "approved") {
      const data = await findAppointmentByDoctorId(id);
      console.log(data);

      const caseData = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentId: data._id,
        status: "pending",
      };

      const newCase = await addNewCase(caseData);

      if (!newCase) {
        return sendResponse(res, 500, "Error while creating case");
      }
    }

    return sendResponse(
      res,
      200,
      "Appointment status updated successfully",
      appointment
    );
  } catch (error) {
    console.log("Error updating appointment or creating case:", error);
    return sendResponse(res, 500, "Server error");
  }
};
module.exports = { doctorLogin, viewAndUpdateAppointment };
