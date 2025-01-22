const HearingRequest = require("../model/hearingRequestModel");

const createHearingRequest = async (data) => {
  return HearingRequest.create(data);
};

const findHearingRequest = async (data) => {
  return HearingRequest.findOne(data);
};

module.exports = {
  createHearingRequest,
  findHearingRequest,
};
