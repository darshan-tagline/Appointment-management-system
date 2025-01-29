const Appointment = require("../model/appoinmentModel");

const findBooking = async (checkBooking) => {
  try {
    return Appointment.findOne(checkBooking);
  } catch (error) {
    console.error("Error while finding booking:", error);
    return null;
  }
};

const findTimeSlot = async (doctorId, date, time) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return Appointment.findOne({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot: time,
    });
  } catch (error) {
    console.error("Error while finding time slot:", error);
    return null;
  }
};

const addNewAppoinment = async (newAppointment) => {
  try {
    return Appointment.create(newAppointment);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const findAppointment = async (data) => {
  try {
    return Appointment.find(data);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const updateStatus = async (id, status) => {
  try {
    return Appointment.findOneAndUpdate({ _id: id }, { status }, { new: true });
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

module.exports = {
  findBooking,
  findTimeSlot,
  addNewAppoinment,
  findAppointment,
  updateStatus,
};
