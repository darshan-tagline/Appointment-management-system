const {
  findAppointment,
  updateStatus,
  addNewAppoinment,
} = require("../service/appoinmentServices");
const { findCase, addNewCase } = require("../service/caseServices");
const sendResponse = require("../utils/responseUtils");
const { findBooking, findTimeSlot } = require("../service/appoinmentServices");
const { findUser } = require("../service/userServices");
const { userRole } = require("../utils/comman");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    const patientId = req.user._id;
    const validDoctorId = await findUser({
      _id: doctorId,
      role: userRole.DOCTOR,
    });
    if (!validDoctorId) {
      return sendResponse(res, 404, "Doctor not found");
    }
    const alreadyExists = await findBooking({
      patientId: patientId,
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

    const booking = await addNewAppoinment({
      patientId: patientId,
      doctorId,
      date,
      timeSlot,
      symptoms,
    });

    return sendResponse(res, 200, "Appointment created successfully", booking);
  } catch (error) {
    console.error("Error creating appointment:>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAppoinment = async (req, res) => {
  try {
    const id = req.user._id;
    const userData = await findUser({ _id: id });
    if (!userData) {
      return sendResponse(res, 404, "Patient not found");
    }
    const appointments = await findAppointment({ patientId: userData._id });
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
    console.log("Error fetching appointments:>>>>>>", error);
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
    console.log("Error fetching appointments:>>>>>>", error);
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
        "Appointment already exists for this user and this appointment is already approved"
      );
    }
    const caseCreated = await addNewCase({
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
    });

    return sendResponse(
      res,
      200,
      "Appointment updated successfully and case created",
      { appointment, caseCreated }
    );
  } catch (error) {
    console.log("Error updating appointment:>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  getAppointmentForDoctor,
  updateAppointment,
  createAppointment,
  getAppoinment,
};
