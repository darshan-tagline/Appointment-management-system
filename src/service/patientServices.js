const Patient = require("../model/patientModel");

const findPatientByVal = async (data) => {
  
  return Patient.findOne(data);
};

const addNewPatient = async (patient) => {
  return Patient.create(patient);
};

const updatePatient = async (email, data) => {
  return Patient.findOneAndUpdate({ email }, data, { new: true });
};
const findPatientandupdate = async (input, data) => {
  return Patient.findOneAndUpdate(
    { email: input },
    {
      email: input,
      otp: data.otp,
      otpExpires: data.otpExpires,
    },
    { new: true }
  );
};

module.exports = {
  findPatientandupdate,
  updatePatient,
  findPatientByVal,
  addNewPatient,
};
