const Appointment = require("../model/appoinmentModel");

const findBooking = async (checkBooking) => {
  return Appointment.findOne(checkBooking);
};

const findTimeSlot = async (doctorId, date, time) => {
   const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); 
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return Appointment.findOne({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay }, 
    timeSlot: time, 
  });
};

const addNewAppoinment = async (newAppointment) => {
  return Appointment.create(newAppointment);
};

const findAppointmentByPatientId = async (data) => {
  return Appointment.find({ patientId: data });
};
const findAppointmentByDoctorId = async (id) => {
  return Appointment.find({ doctorId: id }).sort({ updatedAt: -1 });
};

const updateStatus = async (id, status) => {
  return Appointment.findOneAndUpdate({ _id: id }, { status }, { new: true });
};

module.exports = {
  findBooking,
  findTimeSlot,
  addNewAppoinment,
  findAppointmentByPatientId,
  findAppointmentByDoctorId,
  updateStatus,
};
