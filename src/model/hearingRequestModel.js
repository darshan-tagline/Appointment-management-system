const mongoose = require("mongoose");

const hearingRequestSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending", "completed"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const HearingRequest = mongoose.model("HearingRequest", hearingRequestSchema);

module.exports = HearingRequest;
