const sendResponse = require("../utils/responseUtils");
const { findCasesByPatient, findCasesByDoctor } = require("../service/caseServices");

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


module.exports = { viewCase , getCase};
