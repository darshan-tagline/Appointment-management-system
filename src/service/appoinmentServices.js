const Appointment = require("../model/appoinmentModel");

const findAlready = async (checkBooking) => {
  return Appointment.findOne(checkBooking);
};

const findTimeSlot = async (doctorId, date, time) => {
  return Appointment.findOne({ doctorId, date, time });
};
const addNewAppoinment = async (newAppointment) => {
  return Appointment.create(newAppointment);
};

const findAppointmentByPatientId = async (id) => {
  return Appointment.find({ patientId: id });
};
const findAppointmentByDoctorId = async (id) => {
  return Appointment.find({ doctorId: id }).sort({ updatedAt: -1 });
};

const updateStatus = async (id, status) => {
  return Appointment.updateMany({ doctorId: id }, { status }, { new: true });
};

module.exports = {
  findAlready,
  findTimeSlot,
  addNewAppoinment,
  findAppointmentByPatientId,
  findAppointmentByDoctorId,
  updateStatus,
};
