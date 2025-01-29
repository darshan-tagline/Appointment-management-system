const Hearing = require("../model/hearingModel");

const addNewHearing = async (hearingData) => {
  try {
    return Hearing.create(hearingData);
  } catch (error) {
    console.log("error in creating hearing", error);
    return null;
  }
};

const findHearing = async (data) => {
  try {
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
  } catch (error) {
    console.log("error in finding hearing", error);
    return null;
  }
};

const updateHearingData = async (id, status) => {
  try {
    return Hearing.findByIdAndUpdate(id, { status }, { new: true });
  } catch (error) {
    console.log("error in updating hearing", error);
    return null;
  }
};

module.exports = {
  findHearing,
  updateHearingData,
  addNewHearing,
};
