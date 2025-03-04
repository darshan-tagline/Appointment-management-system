const Bill = require("../model/billModel");

const createBill = async (data) => {
  return Bill.create(data);
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
