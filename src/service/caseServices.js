const Case = require("../model/caseModel");

const addNewCase = async (caseData) => {
  return Case.create(caseData);
};
const findCasesByDoctor = async (data) => {
  console.log(data);
  
  const cases = await Case.find(data)
    .populate("patientId", "name email")
    .populate("appointmentId", "date time symptoms");

  return cases;
};

const findCasesByPatient = async (data) => {
  const cases = await Case.find(data)
    .populate("doctorId", "name email")
    .populate("appointmentId", "date time symptoms");

  return cases;
};

const updateCaseStatus = async (id, status) => {
  return Case.findByIdAndUpdate(id, { status }, { new: true });
};

const findCase = async (data) => {
  return Case.findOne(data);
};

module.exports = {
  addNewCase,
  findCasesByDoctor,
  findCasesByPatient,
  findCase,
  updateCaseStatus,
};
