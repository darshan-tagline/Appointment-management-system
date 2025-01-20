const { Medicine } = require("../model/medicineModel");

const findMedicineByName = async (name) => {
  return Medicine.findOne({ name });
};

const addNewMedicine = async ({ name, price }) => {
  return Medicine.create({ name, price });
};

const findAllMedicines = async () => {
  return Medicine.find();
};

const findMedicineById = async (id) => {
  return Medicine.findById(id);
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

const searchMedicinesByname = async (name) => {
  return Medicine.find({
    name: {
      $regex: `^${name}`,
      $options: "i",
    },
  });
};

module.exports = {
  findMedicineByName,
  addNewMedicine,
  findAllMedicines,
  findMedicineById,
  removeMedicine,
  modifyMedicine,
  searchMedicinesByname,
};
