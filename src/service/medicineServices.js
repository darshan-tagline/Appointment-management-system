const Medicine = require("../model/medicineModel");

const findMedicine = async (data) => {
  return Medicine.findOne(data);
};

const addNewMedicine = async (data) => {
  return Medicine.create(data);
};

const findAllMedicines = async () => {
  return Medicine.find();
};

const findMedicineById = async (data) => {
  return Medicine.findById(data);
};

const removeMedicine = async (id) => {
  return Medicine.findByIdAndDelete(id);
};

const modifyMedicine = async (id, medicine) => {
  const { name, price } = medicine;
  return Medicine.findByIdAndUpdate(
    id,
    { name, price },
    { new: true, runValidators: true }
  );
};

const searchMedicines = async (data, skip, limit) => {
  const isNumeric = !isNaN(data);

  return Medicine.find({
    $or: [
      { name: { $regex: data, $options: "i" } },
      ...(isNumeric ? [{ price: parseFloat(data) }] : []),
    ],
  })
    .skip(skip)
    .limit(limit);
};

module.exports = {
  findMedicine,
  addNewMedicine,
  findAllMedicines,
  findMedicineById,
  removeMedicine,
  modifyMedicine,
  searchMedicines,
};
