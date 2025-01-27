const Patient = require("../model/patientModel");

const findPatientByVal = async (data) => {  
  return Patient.findOne(data);
};

const addNewPatient = async (patient) => {
  return Patient.create(patient);
};

const findAndUpdatePatient = async (filter, updateData) => {
  return Patient.findOneAndUpdate(filter, updateData, { new: true });
};

module.exports = {
  findAndUpdatePatient,
  findPatientByVal,
  addNewPatient,
};
