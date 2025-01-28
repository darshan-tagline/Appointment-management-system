const sendResponse = require("../utils/responseUtils");
const { tokenGeneration } = require("../utils/token");
const {
  addNewAppoinment,
  findTimeSlot,
  findBooking,
  findAppointment,
} = require("../service/appoinmentServices");
const { passwordHash, passwordCompare } = require("../utils/passwordUtils");
const { findCasesByPatient } = require("../service/caseServices");
const {
  createHearingRequest,
  findHearingRequest,
} = require("../service/hearingRequestServices");
const { sendOTP } = require("../utils/otpUtils");
const { findUser, updateUser, addNewUser } = require("../service/userServices");

const patientSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const alreadyExists = await findUser({ email });
    if (alreadyExists) {
      return sendResponse(res, 400, "Patient already exists");
    }

    const hashedPassword = await passwordHash(password);
    const patient = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: "patient",
      isVerified: false,
    });

    await sendOTP(patient.email);
    return sendResponse(res, 201, "OTP sent successfully.");
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const patient = await findUser({ email, role: "patient" });
    if (!patient) {
      return sendResponse(res, 404, "Patient not found.");
    }

    if (new Date() > patient.otpExpires) {
      return sendResponse(res, 400, "OTP has expired.");
    }

    if (patient.otp !== otp) {
      return sendResponse(res, 400, "Invalid OTP.");
    }

    await updateUser(
      { email },
      {
        isVerified: true,
        otp: null,
        otpExpires: null,
      }
    );
    const accessToken = tokenGeneration(
      { id: patient._id, role: patient.role },
      "7d"
    );

    return sendResponse(res, 200, "OTP validated successfully.", {
      accessToken,
    });
  } catch (error) {
    console.error("Error validating OTP:", error);
    return sendResponse(res, 500, "Server error.");
  }
};
// const paientLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await findUser({ email });
//     if (!user) {
//       return sendResponse(res, 401, "Invalid email or password");
//     }
//     if (user.isVerified == false) {
//       return sendResponse(
//         res,
//         401,
//         "Account not verified. Please verify your email."
//       );
//     }
//     const isPasswordMatch = await passwordCompare(password, user.password);
//     if (!isPasswordMatch) {
//       return sendResponse(res, 401, "Invalid email or password");
//     }
//     const accessToken = tokenGeneration(
//       { id: user._id, role: user.role },
//       "7d"
//     );

//     return sendResponse(res, 200, "Login successful", {
//       accessToken,
//     });
//   } catch (error) {
//     console.log("Server Error", error);
//     return sendResponse(res, 500, "Server error");
//   }
// };

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    const data = req.user._id;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, "Authorization token is missing");
    }
    const validDoctorId = await findUser({ _id: doctorId, role: "doctor" });
    if (!validDoctorId) {
      return sendResponse(res, 400, "Doctor not found");
    }
    const alreadyExists = await findBooking({
      patientId: data,
      doctorId,
      date,
      timeSlot,
      symptoms,
    });
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
    const id = req.user._id;
    const data = await findUser({ _id: id });
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
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const viewCase = async (req, res) => {
  try {
    const patientId = req.user._id;
    const data = await findCasesByPatient({ patientId: patientId.toString() });
      
    if (!data) {
      return sendResponse(res, 404, "Case not found");
    }
    return sendResponse(res, 200, "Case fetched successfully", data);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const addHearingRequest = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { caseId, reason } = req.body;

    const caseData = await findCasesByPatient({
      patientId: patientId.toString(),
    });
    if (!caseData || caseData.length === 0) {
      return sendResponse(res, 404, "No cases found for the patient");
    }

    const alreadyExists = await findHearingRequest({ caseId });
    console.log(alreadyExists);

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
    const patientId = req.user._id;
    const data = await findHearingRequest({ patientId });

    if (!data) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", data);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  // paientLogin,
  validateOTP,
  patientSignUp,
  createAppointment,
  getAppoinment,
  viewCase,
  getHearing,
  addHearingRequest,
};
