const HearingRequest = require("../model/hearingRequestModel");

const createHearingRequest = async (data) => {
  try {
    return HearingRequest.create(data);
  } catch (error) {
    console.log("error in creating hearing request", error);
    return null;
  }
};

const findHearingRequest = async (data) => {
  try {
    return HearingRequest.findOne(data);
  } catch (error) {
    console.log("error in finding hearing request", error);
    return null;
  }
};

const getAllHearingRequest = async (caseIds) => {
  try {
    return HearingRequest.find({ caseId: { $in: caseIds } });
  } catch (error) {
    console.log("error in getting all hearing request", error);
    return null;
  }
};

const updateHearingRequest = async (id, data) => {
  try {
    return HearingRequest.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.log("error in updating hearing request", error);
    return null;
  }
};

module.exports = {
  createHearingRequest,
  getAllHearingRequest,
  findHearingRequest,
  updateHearingRequest,
};
