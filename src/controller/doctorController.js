const { findDoctor } = require("../service/doctorServices");
const sendResponse = require("../utils/responseUtils");
const { tokenGeneration } = require("../utils/token");
const {
  updateStatus,
  findAppointmentByDoctorId,
} = require("../service/appoinmentServices");
const {
  addNewCase,
  findCasesByDoctor,
  updateCaseStatus,
} = require("../service/caseServices");
const { passwordCompare } = require("../utils/passwordUtils");
const validate = require("../middleware/validateMiddleware");
const {
  findHearingByCaseId,
  addNewHearing,
} = require("../service/hearingServices");

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
    const appointments = await findAppointmentByDoctorId(doctorId);
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
    console.error("Error fetching appointments:", error);
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

    if (!Array.isArray(prescription) || prescription.length === 0) {
      return sendResponse(
        res,
        400,
        "Prescription must contain at least one medicine."
      );
    }

    const currentDate = new Date();

    const newHearingData = {
      caseId,
      date: currentDate,
      description,
      prescription,
    };
    const existingCase = await findHearingByCaseId({ caseId });
    console.log("existingCase", existingCase);
    
    if (existingCase) {
      return sendResponse(
        res,
        400,
        "Hearing for this case already exists in the database."
      );
    }

    const newHearing = await addNewHearing(newHearingData);

    return sendResponse(res, 201, "Hearing added successfully", newHearing);
  } catch (error) {
    console.error("Error adding hearing:", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hearing = await updateCaseStatus(id, status);
    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing updated successfully", hearing);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
}
module.exports = {
  doctorLogin,
  updateAppointment,
  getAppointmentForDoctor,
  getCase,
  addHearing,
};
