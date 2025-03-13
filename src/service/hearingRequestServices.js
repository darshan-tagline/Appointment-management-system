const HearingRequest = require("../model/hearingRequestModel");

const createHearingRequest = async (data) => {
  return HearingRequest.create(data);
};

const findHearingRequest = async (data) => {
  return HearingRequest.findOne(data);
};

const getAllHearingRequest = async (caseIds) => {
  return HearingRequest.find({ caseId: { $in: caseIds } });
};

const updateHearingRequest = async (id, data) => {
  return HearingRequest.findByIdAndUpdate(id, data, { new: true });
};

const findAllHearingRequest = async () => {
  return HearingRequest.find();
};
module.exports = {
  createHearingRequest,
  getAllHearingRequest,
  findHearingRequest,
  updateHearingRequest,
  findAllHearingRequest,
};
