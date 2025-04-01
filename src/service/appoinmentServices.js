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

const findAppointment = async (data) => {
  return Appointment.find(data);
};

const updateStatus = async (id, status) => {
  return Appointment.findOneAndUpdate({ _id: id }, { status }, { new: true });
};

const findAllAppinments = async (
  query,
  pagination = { page: 1, limit: 10 }
) => {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedQuery = [...query, { $skip: skip }, { $limit: limit }];
  const result = await Appointment.aggregate(paginatedQuery);
  const totalDocuments = result.length || 0;
  const totalPages = Math.ceil(totalDocuments / limit);
  return {
    pagination: {
      page,
      limit,
      totalDocuments,
      totalPages,
    },
    appointments: result || [],
  };
};

const deleteAppoinment = async (id) => {
  return Appointment.findOneAndDelete({ _id: id });
};

module.exports = {
  findBooking,
  findTimeSlot,
  addNewAppoinment,
  findAppointment,
  updateStatus,
  findAllAppinments,
  deleteAppoinment,
};
