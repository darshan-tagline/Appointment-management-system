const Bill = require("../model/billModel");

const createBill = async (caseId, hearingId, totalAmount) => {
  return Bill.create({ caseId, hearingId, totalAmount });
};

const findBill = async (data) => {
  return Bill.findOne(data);
};

const updateBill = async (id, data) => {
  return Bill.findByIdAndUpdate(id, data, { new: true });
};
module.exports = {
  createBill,
  findBill,
  updateBill,
};
