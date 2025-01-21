const sendResponse = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenGeneration } = require("../utils/token");
const {
  findPatientByEmail,
  addNewPatient,
} = require("../service/patientServices");
const {
  findAlready,
  addNewAppoinment,
  findTimeSlot,
  findAppointmentByPatientId,
} = require("../service/appoinmentServices");
const { find } = require("../model/patientModel");

const patientSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const already = await findPatientByEmail(email);
    if (already) {
      return sendResponse(res, 400, "Patient already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const patientData = {
      name,
      email,
      password: hashedPassword,
    };
    const patient = await addNewPatient(patientData);
    const token = await tokenGeneration(patient._id);
    return sendResponse(res, 201, "Account created successfully", { token });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const paientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await findPatientByEmail(email);
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

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, "Authorization token is missing");
    }

    const { id } = jwt.decode(token, process.env.JWT_SECRET);

    const checkBooking = { patientId: id, doctorId, date, timeSlot, symptoms };
    const already = await findAlready(checkBooking);
    if (already) {
      return sendResponse(res, 400, "Appointment already exists");
    }

    const checktimeSlot = await findTimeSlot(doctorId, date, timeSlot);
    if (checktimeSlot) {
      return sendResponse(res, 400, "timeSlot slot already booked");
    }

    const newAppointment = {
      patientId: id,
      doctorId,
      date,
      timeSlot,
      symptoms,
    };
    const booking = await addNewAppoinment(newAppointment);

    return sendResponse(res, 200, "Appointment created successfully", booking);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAppoinment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, "Authorization token is missing");
    }
    const { id } = jwt.decode(token, process.env.JWT_SECRET);
    const appointments = await findAppointmentByPatientId(id);
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

module.exports = {
  paientLogin,
  patientSignUp,
  createAppointment,
  getAppoinment,
};
