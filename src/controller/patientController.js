const sendResponse = require("../utils/responseUtils");
const { tokenGeneration, tokenDecode } = require("../utils/token");
const {
  addNewPatient,
  findPatientByVal,
  findPatientandupdate,
  updatePatient,
} = require("../service/patientServices");
const {
  addNewAppoinment,
  findTimeSlot,
  findBooking,
  findAppointment,
} = require("../service/appoinmentServices");
const { passwordHash, passwordCompare } = require("../utils/passwordUtils");
const { findDoctor } = require("../service/doctorServices");
const { findCasesByPatient } = require("../service/caseServices");
const {
  createHearingRequest,
  findHearingRequest,
} = require("../service/hearingRequestServices");
const { sendOTP } = require("../utils/otpUtils");

const patientSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (email && password) {
      const alreadyExists = await findPatientByVal({ email });
      if (alreadyExists) {
        return sendResponse(res, 400, "Patient already exists");
      }

      const hashedPassword = await passwordHash(password);
      const patientData = {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      };
      const patient = await addNewPatient(patientData);

      await sendOTP(patient.email);
      return sendResponse(res, 201, "Account created successfully. OTP sent.");
    }
    return sendResponse(res, 400, "Email and password required");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const patient = await findPatientByVal({ email });
    if (!patient) {
      return sendResponse(res, 404, "Patient not found.");
    }

    if (new Date() > patient.otpExpires) {
      return sendResponse(res, 400, "OTP has expired.");
    }

    if (patient.otp !== otp) {
      return sendResponse(res, 400, "Invalid OTP.");
    }
    const verificationUpdate = {
      isVerified: true,
      otp: null,
      otpExpires: null,
    };
    await updatePatient(patient._id, verificationUpdate);
    const accessToken = tokenGeneration(patient._id, "7d");

    return sendResponse(res, 200, "OTP validated successfully.", {
      accessToken,
    });
  } catch (error) {
    console.error("Error validating OTP:", error);
    return sendResponse(res, 500, "Server error.");
  }
};
const paientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findPatientByVal({ email });
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    if (!user.isVerified) {
      return sendResponse(
        res,
        401,
        "Account not verified. Please verify your email."
      );
    }
    const isPasswordMatch = await passwordCompare(password, user.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const accessToken = tokenGeneration(user._id, "7d");

    return sendResponse(res, 200, "Login successful", {
      accessToken,
    });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    const data = req.user._id;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, "Authorization token is missing");
    }

    const checkBooking = {
      patientId: data,
      doctorId,
      date,
      timeSlot,
      symptoms,
    };
    const validDoctorId = await findDoctor({ _id: doctorId });
    if (!validDoctorId) {
      return sendResponse(res, 400, "Doctor not found");
    }
    const alreadyExists = await findBooking(checkBooking);
    if (alreadyExists) {
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
    const { id } = req.user.id;
    const data = await findPatientByVal({ id });
    if (!data) {
      return sendResponse(res, 404, "Patient not found");
    }
    const patientId = data._id;
    const appointments = await findAppointment({ patientId });
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

const viewCase = async (req, res) => {
  try {
    const patientId = req.user.id;
    const data = await findCasesByPatient({ patientId });
    if (!data) {
      return sendResponse(res, 404, "Case not found");
    }
    return sendResponse(res, 200, "Case fetched successfully", data);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const addHearingRequest = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    const { caseId, reason } = req.body;

    const caseData = await findCasesByPatient({ patientEmail });
    if (!caseData || caseData.length === 0) {
      return sendResponse(res, 404, "No cases found for the patient");
    }

    const alreadyExists = await findHearingRequest({ caseId });
    if (alreadyExists) {
      return sendResponse(res, 400, "Hearing request already exists");
    }

    const newHearingRequest = await createHearingRequest({
      caseId,
      patientId,
      reason,
    });

    return sendResponse(
      res,
      201,
      "Hearing request created successfully",
      newHearingRequest
    );
  } catch (error) {
    console.error("Error creating hearing request:", error);
    return sendResponse(res, 500, "Server error");
  }
};
const getHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await findHearingRequest({ _id: id });
    if (!data) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", data);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  paientLogin,
  validateOTP,
  patientSignUp,
  createAppointment,
  getAppoinment,
  viewCase,
  getHearing,
  addHearingRequest,
};
