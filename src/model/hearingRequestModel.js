const mongoose = require("mongoose");

const hearingRequestSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "pending"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const HearingRequest = mongoose.model("HearingRequest", hearingRequestSchema);

module.exports = HearingRequest;
