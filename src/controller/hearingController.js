const sendResponse = require("../utils/responseUtils");
const { findCase } = require("../service/caseServices");
const {
  addNewHearing,
  findHearing,
  updateHearingData,
} = require("../service/hearingServices");
const { createBill, findBill } = require("../service/billServices");
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
    const { status } = req.body;
    const hearing = await updateHearingData(id, status);

    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }
    if (hearing.status === "resolved") {
      const existingBill = await findBill({ hearingId: id });

      if (existingBill) {
        return sendResponse(
          res,
          400,
          "Hearing already resolved and bill exists"
        );
      }
      const caseId = hearing.caseId._id;
      const totalAmount = await calculateTotalAmount(hearing);

      const bill = await createBill(caseId, hearing._id, totalAmount);

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

const calculateTotalAmount = async (hearing, res) => {
  try {
    const doctorFee = 100;
    let totalMedicineCost = 0;

    for (let i = 0; i < hearing.prescription.length; i++) {
      const medicine = hearing.prescription[i];

      const medicineDetails = await findMedicine(medicine.medicineId);

      if (!medicineDetails) {
        throw new Error(`Medicine not found`);
      }

      totalMedicineCost += medicineDetails.price * medicine.quantity;
    }

    const totalAmount = totalMedicineCost + doctorFee;

    return totalAmount;
  } catch (error) {
    console.error("Error calculating total amount:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  addHearing,
  getHearing,
  updateHearing,
};
