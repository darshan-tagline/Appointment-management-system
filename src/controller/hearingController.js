const sendResponse = require("../utils/responseUtils");
const { findCase } = require("../service/caseServices");
const {
  addNewHearing,
  findHearing,
  updateHearingData,
} = require("../service/hearingServices");
const { createBill, findBill, updateBill } = require("../service/billServices");
const { findMedicine } = require("../service/medicineServices");

const addHearing = async (req, res) => {
  try {
    const { caseId, description, prescription } = req.body;
    const validCase = await findCase({ _id: caseId });
    if (!validCase) {
      return sendResponse(res, 400, `case does not exist.`);
    }

    const existingCase = await findHearing({ caseId });
    if (existingCase) {
      return sendResponse(res, 400, "Hearing for this case already exists.");
    }
    for (let i = 0; i < prescription.length; i++) {
      const medicine = prescription[i];
      const validMedicine = await findMedicine({ _id: medicine.medicineId });
      if (!validMedicine) {
        return sendResponse(res, 400, `Medicine not found.`);
      }
    }
    const newHearing = await addNewHearing({
      caseId,
      description,
      prescription,
    });

    return sendResponse(res, 201, "Hearing added successfully", newHearing);
  } catch (error) {
    console.error("Error adding hearing:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await findHearing({ _id: id });
    if (!data) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", data);
  } catch (error) {
    console.log("Error in get hearing:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const hearingbyId = await findHearing({ _id: id });

    if (!hearingbyId) {
      return sendResponse(res, 404, "Hearing not found");
    }

    const {
      status,
      description = hearingbyId.description,
      prescription = hearingbyId.prescription,
    } = req.body;

    if (Array.isArray(prescription) && prescription.length > 0) {
      for (const medicine of prescription) {
        const validMedicine = await findMedicine({ _id: medicine.medicineId });
        if (!validMedicine) {
          return sendResponse(res, 400, `Medicine not found.`);
        }
      }
    }

    const hearing = await updateHearingData(id, {
      status,
      description,
      prescription,
    });

    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }

    const existingBill = await findBill({ hearingId: id });
    
    
    if (status === "resolved") {
      if (existingBill) {
        const isPrescriptionChanged =
          hearingbyId.prescription.length !== prescription.length ||
          hearingbyId.prescription.some((oldItem) => {
            const newItem = prescription.find(
              (p) => p.medicineId === oldItem.medicineId
            );
            return !newItem || newItem.quantity !== oldItem.quantity;
          });

        if (isPrescriptionChanged) {
          const totalAmount = await calculateTotalAmount(hearing);
          const updatedBill = await updateBill(existingBill._id, {
            totalAmount,
            prescription,
          });

          return sendResponse(res, 200, "Hearing updated and bill updated", {
            hearing,
            updatedBill,
          });
        }

        return sendResponse(res, 200, "Hearing updated successfully", hearing);
      }

      const caseId = hearing.caseId._id;
      const totalAmount = await calculateTotalAmount(hearing);
      const bill = await createBill({
        caseId,
        hearingId: hearing._id,
        prescription,
        totalAmount,
      });

      return sendResponse(res, 200, "Hearing updated and bill created", {
        hearing,
        bill,
      });
    }

    return sendResponse(res, 200, "Hearing updated successfully", hearing);
  } catch (error) {
    console.log("Error in update hearing:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const calculateTotalAmount = async (hearing) => {
  try {
    const doctorFee = 100;
    let totalMedicineCost = 0;
    const medicineMap = new Map();

    for (const medicine of hearing.prescription) {
      if (medicineMap.has(medicine.medicineId)) {
        medicineMap.set(
          medicine.medicineId,
          medicineMap.get(medicine.medicineId) + medicine.quantity
        );
      } else {
        medicineMap.set(medicine.medicineId, medicine.quantity);
      }
    }
    for (const [medicineId, quantity] of medicineMap) {
      const medicineDetails = await findMedicine(medicineId);
      if (!medicineDetails) {
        throw new Error(`Medicine not found`);
      }
      totalMedicineCost += medicineDetails.price * quantity;
    }

    return totalMedicineCost + doctorFee;
  } catch (error) {
    console.error("Error calculating total amount:>>>>>", error);
    throw new Error("Failed to calculate total amount");
  }
};

module.exports = {
  addHearing,
  getHearing,
  updateHearing,
};
