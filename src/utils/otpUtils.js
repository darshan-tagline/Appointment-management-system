const { findPatientandupdate } = require("../service/patientServices");
const sendEmail = require("./sendMail");

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOTP = async (email) => {
  try {
    const otp = generateOtp();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    const patient = await findPatientandupdate({
      email,
      otp,
      otpExpires,
    });

    await sendEmail(
      patient.email,
      "Verify Your Account: OTP Inside",
      `Dear User,
Your One-Time Password (OTP) for verification is: ${otp}.
Please enter this OTP to complete your request.
Note: This OTP is valid for a limited time and can only be used once.`
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

module.exports = {
  generateOtp,
  sendOTP,
};
