const mongoose = require("mongoose");
const { userRole } = require("../utils/comman");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      enum: [userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT],
      required: true,
      lowercase: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isVerified: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
