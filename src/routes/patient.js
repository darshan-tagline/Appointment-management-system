const express = require("express");
const { viewCase } = require("../controller/patientController");
const { appoinmentRouter } = require("./appointmentRoutes");
const { hearingRequestRouterForPatient } = require("./hearingRequestRoutes");
const patientRouter = express.Router();

patientRouter.use("/appointment", appoinmentRouter);
patientRouter.use("/hearingrequest", hearingRequestRouterForPatient);
patientRouter.get("/case", viewCase);

module.exports = patientRouter;
