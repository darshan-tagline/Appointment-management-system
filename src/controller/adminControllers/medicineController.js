const sendResponse = require("../../utils/responseUtils");
const {
  addNewMedicine,
  findAllMedicines,
  findMedicine,
  findMedicineById,
  removeMedicine,
  modifyMedicine,
} = require("../../service/medicineServices");

const addMedicine = async (req, res) => {
  try {
    const { name, price } = req.body;
    const alreadyExist = await findMedicine({ name });
    if (alreadyExist) {
      return sendResponse(res, 400, "Medicine already exists");
    }
    await addNewMedicine({ name, price });
    return sendResponse(res, 201, "Medicine added successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const { name } = req.params;
    let medicines;
    if (name) {
      medicines = await findMedicine({ name });
      if (!medicines || medicines.length === 0) {
        return sendResponse(res, 404, "No medicines found with the given name");
      }
    } else {
      medicines = await findAllMedicines();
    }

    return sendResponse(
      res,
      200,
      name ? "Medicine fetched successfully" : "Medicines fetched successfully",
      medicines
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await findMedicineById(id);
    if (!medicine) {
      return sendResponse(res, 404, "Medicine not found");
    }
    return sendResponse(res, 200, "Medicine fetched successfully", medicine);
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const alreadyExist = await findMedicine({ name });
    if (alreadyExist) {
      return sendResponse(res, 400, "Medicine already exists");
    }
    const updatedMedicine = await modifyMedicine(id, {
      name,
      price,
    });

    if (!updatedMedicine) {
      return sendResponse(res, 404, "Medicine not found");
    }

    return sendResponse(
      res,
      200,
      "Medicine updated successfully",
      updatedMedicine
    );
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await removeMedicine(id);
    if (!medicine) {
      return sendResponse(res, 404, "Medicine not found");
    }
    return sendResponse(res, 200, "Medicine deleted successfully");
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
