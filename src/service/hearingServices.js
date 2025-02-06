const Hearing = require("../model/hearingModel");

const addNewHearing = async (hearingData) => {
  return Hearing.create(hearingData);
};

const findHearing = async (data) => {  
  return Hearing.findOne(data)
    .populate({
      path: "prescription",
      select: "quantity duration medicineId",
      populate: {
        path: "medicineId",
        select: "name price",
      },
    })
    .populate({
      path: "caseId",
      select: "patientId appointmentId",
    });
};

const updateHearingData = async (id, data) => {
    return Hearing.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  findHearing,
  updateHearingData,
  addNewHearing,
};
