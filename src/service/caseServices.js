const Case = require("../model/caseModel");

const addNewCase = async (caseData) => {
  return Case.create(caseData);
};

module.exports = {
  addNewCase,
};
