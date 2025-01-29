const Case = require("../model/caseModel");

const addNewCase = async (caseData) => {
  try {
    return Case.create(caseData);
  } catch (error) {
    console.log("error adding case", error);
    return null;
  }
};
const findCasesByDoctor = async (data) => {
  try {
    const cases = await Case.find(data)
      .populate("patientId", "name email")
      .populate("appointmentId", "date time symptoms");

    return cases;
  } catch (error) {
    console.log("error finding cases by doctor", error);
    return null;
  }
};

const findCasesByPatient = async (data) => {
  try {
    const cases = await Case.find(data)
      .populate("doctorId", "name email")
      .populate("appointmentId", "date time symptoms");

    return cases;
  } catch (error) {
    console.log("error finding cases by patient", error);
    return null;
  }
};

const updateCaseStatus = async (id, status) => {
  try {
    return Case.findByIdAndUpdate(id, { status }, { new: true });
  } catch (error) {
    console.log("error updating case status", error);
    return null;
  }
};

const findCase = async (data) => {
  try {
    return Case.findOne(data);
  } catch (error) {
    console.log("error finding case", error);
    return null;
  }
};

module.exports = {
  addNewCase,
  findCasesByDoctor,
  findCasesByPatient,
  findCase,
  updateCaseStatus,
};
