const Patient = require("../model/patientModel");

const findPatient = async (data) => {
  return Patient.findById(data);
};
const findPatientByVal = async (data) => {
  return Patient.findOne(data);
};

const addNewPatient = async (patient) => {
  return Patient.create(patient);
};

const findPatientandupdate = async (data) => {
  return Patient.findOneAndUpdate(
    { email: data.email },
    { otp: data.otp, otpExpires: data.otpExpires },
    { new: true }
  );
};

module.exports = {
  findPatientandupdate,
  findPatientByVal,
  findPatient,
  addNewPatient,
};
