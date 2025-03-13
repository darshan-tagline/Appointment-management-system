const Case = require("../model/caseModel");

const addNewCase = async (caseData) => {
  return Case.create(caseData);
};
const findCasesByDoctor = async (data) => {
  const cases = await Case.find(data)
    .populate("patientId", "name email")
    .populate("appointmentId", "date time symptoms");

  return cases;
};

const findCasesByPatient = async (data) => {
  const cases = await Case.find(data)
    .populate("doctorId", "name email")
    .populate("appointmentId", "date time symptoms");

  return cases;
};

const findCase = async (data) => {
  return Case.findOne(data);
};

const deleteCase = async (data) => {
  return Case.deleteOne(data);
}
const findCases = async (query, pagination) => {
  const page = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedQuery = [...query, { $skip: skip }, { $limit: limit }];
  const result = await Case.aggregate(paginatedQuery);
  const totalDocuments = result.length || 0;
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    pagination: {
      page,
      limit,
      totalDocuments,
      totalPages,
    },
    Cases: result[0] || [],
  };
};

module.exports = {
  addNewCase,
  findCasesByDoctor,
  findCasesByPatient,
  findCase,
  findCases,
  deleteCase,
};
