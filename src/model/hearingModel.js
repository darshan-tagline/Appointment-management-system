const mongoose = require("mongoose");
const { status } = require("../utils/comman");

const hearingSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      lowercase: true,
      enum: [status.RESOLVED, status.INPROGRESS],
      default: status.INPROGRESS,
    },
    prescription: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Hearing = mongoose.model("Hearing", hearingSchema);

module.exports = Hearing;
