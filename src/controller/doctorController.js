const { findDoctor } = require("../service/doctorServices");
const sendResponse = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenGeneration } = require("../utils/token");
const {
  updateStatus,
  findAppointmentByDoctorId,
} = require("../service/appoinmentServices");
const { addNewCase } = require("../service/caseServices");
const { passwordCompare } = require("../utils/passwordUtils");

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

const getappoinment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, "Authorization token is missing");
    }
    const { data } = jwt.decode(token, process.env.JWT_SECRET);
    const appointments = await findAppointmentByDoctorId(data);
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
      {appointment, caseCreated}
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = { doctorLogin, updateAppointment, getappoinment };
