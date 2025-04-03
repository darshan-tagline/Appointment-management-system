const mongoose = require("mongoose");
const { status } = require("../utils/comman");
const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    symptoms: { type: String },
    status: { type: String, default: status.PENDING },
  },
  { versionKey: false, timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
