const  Doctor  = require("../model/doctorModel");

const findDoctorByEmail = async (email) => {
  return Doctor.findOne({ email });
};

const addDoctor = async (doctorData) => {
  return Doctor.create(doctorData);
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

const searchDoctorByName = async (name) => {
  return Doctor.find({
    name: {
      $regex: `^${name}`,
      $options: "i",
    },
  });
};

const modifyDoctor = async (id, doctor) => {
  const { name, email, category, password } = doctor;
  return Doctor.findByIdAndUpdate(
    id,
    { name, email, category, password },
    { new: true, runValidators: true }
  );
};

module.exports = {
  findDoctorByEmail,
  addDoctor,
  findDoctorById,
  findAllDoctors,
  removeDoctor,
  modifyDoctor,
  searchDoctorByName,
};
