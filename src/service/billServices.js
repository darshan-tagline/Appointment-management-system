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
    console.log("Server Error", error);

    throw new Error("Error creating bill");
  }
};

const findBill = async (data) => {
  try {
    return Bill.findOne(data);
  } catch (error) {
    console.log("Server Error", error);
    return null;
  }
};
module.exports = {
  createBill,
  findBill,
};
