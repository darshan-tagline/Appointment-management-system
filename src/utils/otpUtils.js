const { updateUser } = require("../service/userServices");
const { emailSubject, emailText } = require("./comman");

const sendEmail = require("./sendMail");

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOTP = async (email) => {
  try {
    const otp = generateOtp();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    const patient = await updateUser(
      { email },
      {
        otp: "1234",
        otpExpires,
      }
    );
    await sendEmail(
      patient.email,
      emailSubject.PATIENT,
      emailText.PATIENT(otp)
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

module.exports = {
  generateOtp,
  sendOTP,
};
