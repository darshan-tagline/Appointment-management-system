const sendResponse = require("../utils/responseUtils");
const {
  findCasesByPatient,
  findCasesByDoctor,
  findCases,
} = require("../service/caseServices");

const viewCase = async (req, res) => {
  try {
    const patientId = req.user._id;
    const caseData = await findCasesByPatient({
      patientId: patientId.toString(),
    });

    if (!caseData) {
      return sendResponse(res, 404, "Case not found");
    }
    return sendResponse(res, 200, "Case fetched successfully", caseData);
  } catch (error) {
    console.log("Error in view case:>>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getCase = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctorData = await findCasesByDoctor({ doctorId });
    if (!doctorData) {
      return sendResponse(res, 404, "Case not found");
    }
    return sendResponse(res, 200, "Case fetched successfully", doctorData);
  } catch (error) {
    console.log("Error in get case:>>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getAllCases = async (req, res) => {
  try {
    const queryParams = req.query;
    const cases = await findCases(
      [
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
          },
        },
        {
          $lookup: {
            from: "appointments",
            localField: "appointmentId",
            foreignField: "_id",
            as: "appointment",
          },
        },
        {
          $unwind: "$patient",
        },
        {
          $unwind: "$doctor",
        },
        {
          $unwind: "$appointment",
        },
        {
          $project: {
            patient: {
              _id: 1,
              name: 1,
              email: 1,
            },
            doctor: {
              _id: 1,
              name: 1,
              email: 1,
            },
            appointment: {
              _id: 1,
              date: 1,
              timeSlot: 1,
              symptoms: 1,
              status: 1,
            },
          },
        },
      ],
      queryParams
    );
    if (!cases) return sendResponse(res, 204, "No cases Found");
    return sendResponse(res, 200, "All cases", cases);
  } catch (error) {
    console.log("Error in get All Case:>>>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};
module.exports = { viewCase, getCase, getAllCases };
