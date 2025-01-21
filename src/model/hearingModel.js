const mongoose = require("mongoose");

const hearingSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress"],
      default: "In Progress",
    },
    prescription: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Hearing = mongoose.model("Hearing", hearingSchema);

module.exports = Hearing;
