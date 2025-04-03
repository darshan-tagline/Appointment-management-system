const mongoose = require("mongoose");
const { status } = require("../utils/comman");

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
      lowercase: true,
      enum: [
        status.APPROVED,
        status.REJECTED,
        status.PENDING,
        status.COMPLETED,
      ],
      default: status.PENDING,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const HearingRequest = mongoose.model("HearingRequest", hearingRequestSchema);

module.exports = HearingRequest;
