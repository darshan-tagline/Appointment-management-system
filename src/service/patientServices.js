const Patient = require("../model/patientModel");

const findPatient = async (data) => {
  return Patient.findOne(data);
};

const addNewPatient = async (patient) => {
  return Patient.create(patient);
};
module.exports = {
  findPatient,
  addNewPatient,
};
