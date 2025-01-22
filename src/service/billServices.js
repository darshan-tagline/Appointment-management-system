const Bill = require("../model/billModel");

const createBill = async (caseId, hearingId, totalAmount) => {
  try {
    const newBill = new Bill({
      caseId,
      hearingId,
      totalAmount,
    });
    await newBill.save();
    return newBill;
  } catch (error) {
    console.log("error", error);

    throw new Error("Error creating bill");
  }
};

const findBill = async (data) => {
  return Bill.findOne(data);
};
module.exports = {
  createBill,
  findBill,
};
