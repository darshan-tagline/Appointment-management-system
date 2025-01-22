const Doctor = require("../model/doctorModel");

const findDoctor = async (data) => {
  return Doctor.findOne(data);
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

const searchDoctor = async (data,skip,limit) => {
  return Doctor.find({
    $or: [
      { name: { $regex: `^${data}`, $options: "i" } },
      { email: { $regex: `^${data}`, $options: "i" } },
    ],
  })
    .skip(skip)
    .limit(limit);
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
  findDoctor,
  addDoctor,
  findDoctorById,
  findAllDoctors,
  removeDoctor,
  modifyDoctor,
  searchDoctor,
};
