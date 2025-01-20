const { Doctor } = require("../model/doctorModel");

const findDoctorByEmail = async (email) => {
  return Doctor.findOne({ email });
};

const addDoctor = async (doctorData) => {
  return Doctor.create( doctorData );
};

const findDoctorById = async (id) => {
  return Doctor.findById(id);
};

const findAllDoctors = async () => {
  return Doctor.find();
};

const removeDoctor = async (id) => {
  return Doctor.findByIdAndDelete(id);
};

const modifyDoctor = async (id, doctor) => {
  return Doctor.findByIdAndUpdate(id, { doctor });
};

module.exports = {
  findDoctorByEmail,
  addDoctor,
  findDoctorById,
  findAllDoctors,
  removeDoctor,
  modifyDoctor,
};