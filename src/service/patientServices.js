const Patient = require("../model/patientModel");

const findPatientByVal = async (data) => {  
  return Patient.findOne(data);
};

const addNewPatient = async (patient) => {
  return Patient.create(patient);
};

const findPatientandupdate = async (data) => {
  return Patient.findOneAndUpdate(
    { email: data.email },
    {
      otp: data.otp,
      otpExpires: data.otpExpires,
    },
    { new: true }
  );
};

const updatePatient = async (id, data) => {
  return Patient.findOneAndUpdate({ _id: id }, data);
};

module.exports = {
  findPatientandupdate,
  updatePatient,
  findPatientByVal,
  addNewPatient,
};
