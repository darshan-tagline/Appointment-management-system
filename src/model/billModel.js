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
    precption: [
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
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
