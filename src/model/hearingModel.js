const mongoose = require("mongoose");

const hearingSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    date: {
      type: Date,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine", 
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Hearing = mongoose.model("Hearing", hearingSchema);

module.exports = Hearing;
