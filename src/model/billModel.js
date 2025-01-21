const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    hearingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hearing",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
