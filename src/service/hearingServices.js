const Hearing = require("../model/hearingModel");

const addNewHearing = async (hearingData) => {  
  return Hearing.create(hearingData);
};

const findHearing = async (data) => {
  return Hearing.findOne(data)
    .populate({
      path: "prescription",
      select: "dosage duration medicineId",
    })
    .populate({
      path: "caseId",
      select: "patientId appointmentId",
    })
    .exec();
};

const updateHearingData = async (id, status) => {
  return Hearing.findByIdAndUpdate(id, { status }, { new: true });
};

module.exports = {
  findHearing,
  updateHearingData,
  addNewHearing,
};
