const Medicine = require("../model/medicineModel");

const findMedicine = async (data) => {
  return Medicine.findOne(data);
};

const addNewMedicine = async (data) => {
  return Medicine.create(data);
};

const removeMedicine = async (id) => {
  return Medicine.findByIdAndDelete(id);
};

const modifyMedicine = async (id, medicine) => {
  return Medicine.findByIdAndUpdate(id, medicine, {
    new: true,
    runValidators: true,
  });
};

const searchMedicine = async (data) => {
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;

  return Medicine.aggregate([
    {
      $match: {
        ...(data.name && { name: { $regex: data.name, $options: "i" } }),
        ...(data.price && { price: Number(data.price) }),
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
};

module.exports = {
  findMedicine,
  addNewMedicine,
  removeMedicine,
  searchMedicine,
  modifyMedicine,
};
