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
} = require("../service/caseServices");
const { passwordCompare } = require("../utils/passwordUtils");
const {
  addNewHearing,
  findHearing,
  updateHearingData,
} = require("../service/hearingServices");
const { default: mongoose } = require("mongoose");
const { createBill } = require("../service/billServices");

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
    for (let i = 0; i < prescription.length; i++) {
      const { medicineId, dosage, duration } = prescription[i];
      if (!medicineId || !dosage || !duration) {
        return sendResponse(
          res,
          400,
          "Each medicine must have a valid medicineId, dosage, and duration."
        );
      }
      if (mongoose.Types.ObjectId.isValid(medicineId)) {
        prescription[i].medicineId = new mongoose.Types.ObjectId(medicineId);
      } else {
        return sendResponse(res, 400, "Invalid medicineId.");
      }
    }
    const newHearingData = {
      caseId,
      description,
      prescription,
    };
        const existingCase = await findHearing({ caseId });
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

    if (/^resolved$/i.test(status)) {
      const caseId = hearing.caseId._id;
      const totalAmount = calculateTotalAmount(hearing);

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

const calculateTotalAmount = (hearing) => {
  const medicineCount = hearing.prescription.length;
  const ratePerMedicine = 50;
  return medicineCount * ratePerMedicine;
};
module.exports = {
  doctorLogin,
  updateAppointment,
  getAppointmentForDoctor,
  getCase,
  getHearing,
  addHearing,
  updateHearing,
};
