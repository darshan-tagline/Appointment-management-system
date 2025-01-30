const Bill = require("../model/billModel");

const createBill = async (caseId, hearingId, totalAmount) => {
  return Bill.create({ caseId, hearingId, totalAmount });
};

const findBill = async (data) => {
  return Bill.findOne(data);
};
module.exports = {
  createBill,
  findBill,
};
