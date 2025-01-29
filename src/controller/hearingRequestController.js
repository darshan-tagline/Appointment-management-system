const sendResponse = require("../utils/responseUtils");
const { findCasesByPatient, findCasesByDoctor } = require("../service/caseServices");
const {
  createHearingRequest,
  findHearingRequest,
  updateHearingRequest,
  getAllHearingRequest,
} = require("../service/hearingRequestServices");

const addHearingRequest = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { caseId, reason } = req.body;

    const caseData = await findCasesByPatient({
      patientId: patientId.toString(),
    });
    if (!caseData || caseData.length === 0) {
      return sendResponse(res, 404, "No cases found for the patient");
    }

    const alreadyExists = await findHearingRequest({ caseId });
    if (alreadyExists) {
      return sendResponse(res, 400, "Hearing request already exists");
    }

    const newHearingRequest = await createHearingRequest({
      caseId,
      patientId,
      reason,
    });

    return sendResponse(
      res,
      201,
      "Hearing request created successfully",
      newHearingRequest
    );
  } catch (error) {
    console.error("Error creating hearing request:", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getHearing = async (req, res) => {
  try {
    const patientId = req.user._id;
    const data = await findHearingRequest({ patientId });

    if (!data) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", data);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const getHearingRequests = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const cases = await findCasesByDoctor({ doctorId });
    const caseIds = cases.map((caseItem) => caseItem._id);
    const caseData = await getAllHearingRequest(caseIds);
    if (!caseData) {
      return sendResponse(res, 404, "Hearing not found");
    }
    return sendResponse(res, 200, "Hearing fetched successfully", caseData);
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

const updateHearingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const hearingRequest = await findHearingRequest({ _id: id });
    if (!hearingRequest) {
      return sendResponse(res, 404, "Hearing request not found");
    }
    const updatedHearingRequest = await updateHearingRequest(id, { status });

    return sendResponse(
      res,
      200,
      "Hearing status updated successfully",
      updatedHearingRequest
    );
  } catch (error) {
    console.error("Error updating hearing status:", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  addHearingRequest,
  getHearing,
  getHearingRequests,
  updateHearingStatus,
};