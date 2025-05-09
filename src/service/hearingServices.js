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

const findAllHearings = async (query, pagination) => {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedQuery = [...query, { $skip: skip }, { $limit: limit }];
  const result = await Hearing.aggregate(paginatedQuery);
  const totalDocuments = await Hearing.countDocuments();
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

const fetchAllHearings = async (id) => {
  return Hearing.find({ doctorId: id });
};
const removeHearing = async (id) => {
  return Hearing.findByIdAndDelete(id);
};

module.exports = {
  findHearing,
  updateHearingData,
  addNewHearing,
  findAllHearings,
  removeHearing,
  fetchAllHearings,
};
