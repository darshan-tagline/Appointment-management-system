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



module.exports = {
  findMedicine,
  addNewMedicine,
  findAllMedicines,
  findMedicineById,
  removeMedicine,
  modifyMedicine,
  
};
