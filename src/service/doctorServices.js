const Doctor = require("../model/doctorModel");

const findDoctor = async (data) => {
  return Doctor.findOne(data);
};

const addDoctor = async (doctorData) => {
  return Doctor.create(doctorData);
};

const findAllDoctors = async () => {
  return Doctor.find();
};

const removeDoctor = async (id) => {
  return Doctor.findByIdAndDelete(id);
};

const modifyDoctor = async (id, doctor) => {
  return Doctor.findByIdAndUpdate(id, doctor, {
    new: true,
    runValidators: true,
  });
};

const searchDoctor = async (data) => {
  const query = {};
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;

  data.name && (query.name = { $regex: data.name, $options: "i" });
  data.email && (query.email = { $regex: data.email, $options: "i" });

  return Doctor.aggregate([
    {
      $match: query,
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
};

module.exports = {
  findDoctor,
  addDoctor,
  searchDoctor,
  findAllDoctors,
  removeDoctor,
  modifyDoctor,
};
