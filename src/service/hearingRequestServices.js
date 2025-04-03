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

const findAllHearingRequest = async (query, pagination) => {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedQuery = [...query, { $skip: skip }, { $limit: limit }];
  const result = await HearingRequest.aggregate(paginatedQuery);
  const totalDocuments = result.length || 0;
  const totalPages = Math.ceil(totalDocuments / limit);
  return {
    pagination: {
      page,
      limit,
      totalDocuments,
      totalPages,
    },
    Hearings: result || [],
  };
};
module.exports = {
  createHearingRequest,
  getAllHearingRequest,
  findHearingRequest,
  updateHearingRequest,
  findAllHearingRequest,
};
