const sendResponse = require("../utils/responseUtils");
const { findCase } = require("../service/caseServices");
const {
  addNewHearing,
  findHearing,
  updateHearingData,
  findAllHearings,
  removeHearing,
  fetchAllHearings,
} = require("../service/hearingServices");
const { createBill, findBill, updateBill } = require("../service/billServices");
const { findMedicine } = require("../service/medicineServices");

const addHearing = async (req, res) => {
  try {
    const { caseId, description, prescription } = req.body;
    const { doctorId } = await findCase({ _id: caseId });
    if (!doctorId) {
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
      doctorId,
      description,
      prescription,
    });

    return sendResponse(res, 201, "Hearing added successfully", newHearing);
  } catch (error) {
    console.error("Error adding hearing:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const findAllhearing = async (req, res) => {
  try {
    const id = req.user._id;
    const hearings = await fetchAllHearings(id);
    return sendResponse(res, 200, "Hearings fetched successfully", hearings);
  } catch (error) {
    console.log("Error in get all hearings:>>>>>", error);
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

    const lowercaseStatus = status.toLowerCase();
    const hearing = await updateHearingData(id, {
      status,
      description,
      prescription,
    });

    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }

    const existingBill = await findBill({ hearingId: id });

    if (lowercaseStatus == "resolved") {
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
          const bill = await updateBill(existingBill._id, {
            totalAmount,
            prescription,
          });

          return sendResponse(res, 200, "Hearing updated and bill updated", {
            hearing,
            bill,
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

const getAllHearings = async (req, res) => {
  try {
    const queryParams = req.query;
    const hearings = await findAllHearings(
      [
        {
          $lookup: {
            from: "medicines",
            localField: "prescription.medicineId",
            foreignField: "_id",
            as: "medicineDetails",
          },
        },
        {
          $unwind: {
            path: "$medicineDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "cases",
            localField: "caseId",
            foreignField: "_id",
            as: "caseDetails",
          },
        },
        {
          $unwind: {
            path: "$caseDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "appointments",
            localField: "caseDetails.appointmentId",
            foreignField: "_id",
            as: "appointmentDetails",
          },
        },
        {
          $unwind: {
            path: "$appointmentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "caseDetails.patientId",
            foreignField: "_id",
            as: "patientDetails",
          },
        },
        {
          $unwind: {
            path: "$patientDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            caseId: 1,
            description: 1,
            status: 1,
            prescription: {
              $map: {
                input: "$prescription",
                as: "item",
                in: {
                  medicineId: "$$item.medicineId",
                  medicineDetails: {
                    name: "$medicineDetails.name",
                    price: "$medicineDetails.price",
                  },
                  quantity: "$$item.quantity",
                  duration: "$$item.duration",
                },
              },
            },
            appointmentDetails: 1,
            patientDetails: {
              _id: "$patientDetails._id",
              name: "$patientDetails.name",
              email: "$patientDetails.email",
              phone: "$patientDetails.phone",
            },
          },
        },
      ],
      queryParams
    );

    return sendResponse(res, 200, "All Hearings", hearings);
  } catch (error) {
    console.log("getAllHearings error:======>>", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const getHearingById = async (req, res) => {
  try {
    const { id } = req.params;
    const hearing = await findHearing({ _id: id });
    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", hearing);
  } catch (error) {
    console.log("Error in get hearing:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const deleteHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const hearing = await removeHearing({ _id: id });
    if (!hearing) {
      return sendResponse(res, 404, "Hearing not found");
    }
    await removeHearing(id);
    return sendResponse(res, 200, "Hearing deleted successfully");
  } catch (error) {
    console.log("Error in delete hearing:>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};
module.exports = {
  addHearing,
  getHearing,
  updateHearing,
  getAllHearings,
  getHearingById,
  findAllhearing,
  deleteHearing,
};
