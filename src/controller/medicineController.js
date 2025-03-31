const sendResponse = require("../utils/responseUtils");
const {
  addNewMedicine,
  findMedicine,
  removeMedicine,
  modifyMedicine,
  searchMedicine,
} = require("../service/medicineServices");
const { findHearing } = require("../service/hearingServices");

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
    console.log("Error in add medicine:>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const queryParams = req.query;
    let medicines = await searchMedicine(queryParams);

    if (medicines.length == 0) {
      return sendResponse(res, 404, "No medicines found with the given name");
    }
    return sendResponse(res, 200, "Medicines fetched successfully", medicines);
  } catch (error) {
    console.log("Error in get all medicines:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await findMedicine({ _id: id });
    if (!medicine) {
      return sendResponse(res, 404, "Medicine not found");
    }
    return sendResponse(res, 200, "Medicine fetched successfully", medicine);
  } catch (error) {
    console.log("Error in get medicine by id:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const alreadyExist = await findMedicine({ name });
    if (name && alreadyExist && alreadyExist._id != id) {
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
    console.log("Error in update medicine:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const hearing = await findHearing({ "prescription.medicineId": id });
    if (hearing) {
      return sendResponse(res, 400, "Medicine cannot be deleted");
    }

    const medicine = await removeMedicine(id);
    if (!medicine) {
      return sendResponse(res, 404, "Medicine not found");
    }
    return sendResponse(res, 200, "Medicine deleted successfully");
  } catch (error) {
    console.log("Error in delete medicine:>>>>>", error);
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
