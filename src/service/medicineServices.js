const Medicine = require("../model/medicineModel");

const findMedicine = async (data) => {
  try {
    return Medicine.findOne(data);
  } catch (error) {
    console.log("error in finding medicine", error);
    return null;
  }
};

const addNewMedicine = async (data) => {
  try {
    return Medicine.create(data);
  } catch (error) {
    console.log("error in adding new medicine", error);
    return null;
  }
};

const removeMedicine = async (id) => {
  try {
    return Medicine.findByIdAndDelete(id);
  } catch (error) {
    console.log("error in removing medicine", error);
    return null;
  }
};

const modifyMedicine = async (id, medicine) => {
  try {
    return Medicine.findByIdAndUpdate(id, medicine, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.log("error in modifying medicine", error);
    return null;
  }
};

const searchMedicine = async (data) => {
  try {
    const query = {};
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;

  data.name && (query.name = { $regex: data.name, $options: "i" });
  data.price && (query.price = Number(data.price));

  return Medicine.aggregate([
    {
      $match: query,
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
  } catch (error) {
    console.log("error in searching medicine", error);
    return null;
  }
};

module.exports = {
  findMedicine,
  addNewMedicine,
  removeMedicine,
  searchMedicine,
  modifyMedicine,
};
