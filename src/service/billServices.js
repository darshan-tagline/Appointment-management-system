const Bill = require("../model/billModel");

const createBill = async (caseId, hearingId, precption,totalAmount) => {
  return Bill.create({ caseId, hearingId, precption,totalAmount });
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
