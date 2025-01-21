const sendResponse = require("../utils/responseUtils");
const jwt = require("jsonwebtoken");
const { tokenGeneration, tokenDecode } = require("../utils/token");
const { addNewPatient, findPatient } = require("../service/patientServices");
const {
  findAlready,
  addNewAppoinment,
  findTimeSlot,
  findAppointmentByPatientId,
  findBooking,
} = require("../service/appoinmentServices");
const { passwordHash, passwordCompare } = require("../utils/passwordUtils");

const patientSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const already = await findPatient({ email });
    if (already) {
      return sendResponse(res, 400, "Patient already exists");
    }
    const hashedPassword = await passwordHash(password);
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
    const user = await findPatient({ email });
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const isPasswordMatch = await passwordCompare(password, user.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = tokenGeneration(user._id);
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

    const { data } = await tokenDecode(token);

    const checkBooking = {
      patientId: data,
      doctorId,
      date,
      timeSlot,
      symptoms,
    };
    const already = await findBooking(checkBooking);
    if (already) {
      return sendResponse(res, 400, "Appointment already exists");
    }
    const checktimeSlot = await findTimeSlot(doctorId, date, timeSlot);
    if (checktimeSlot) {
      return sendResponse(res, 400, "timeSlot slot already booked");
    }

    const newAppointment = {
      patientId: data,
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
    const { data } = jwt.decode(token, process.env.JWT_SECRET);
    console.log(data);

    const appointments = await findAppointmentByPatientId(data);
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
