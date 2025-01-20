const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    symptoms: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
