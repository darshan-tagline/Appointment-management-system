const Hearing = require("../model/hearingModel");

const addNewHearing = async (hearingData) => {
  return Hearing.create(hearingData);
};

const findHearingByCaseId = async (data) => {    
  return Hearing.findOne(data);
};

module.exports = {
  findHearingByCaseId,
  addNewHearing,
};
