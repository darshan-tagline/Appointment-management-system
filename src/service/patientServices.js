const Patient = require("../model/patientModel");

const findPatientByEmail = async (email) => {
  return Patient.findOne({ email });
};

const addNewPatient = async (patient) => {
  return Patient.create(patient);
};
module.exports = {
  findPatientByEmail,
  addNewPatient,
};
