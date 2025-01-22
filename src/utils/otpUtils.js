const {
  findPatientandupdate,
  
} = require("../service/patientServices");
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

    await sendEmail(patient.email, "Your OTP Code", `Your OTP is ${otp}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// const validateOTP = async (email, otp) => {
//   try {
//     const user = await findPatient({ email });

//     if (!user || !user.otp) {
//       return sendResponse(res, 400, "OTP not found.");
//     }

//     if (new Date() > user.otpExpires) {
//       return sendResponse(res, 400, "OTP has expired.");
//     }

//     if (user.otp !== otp) {
//       return sendResponse(res, 400, "Invalid OTP.");
//     }

//     return sendResponse(res, 200, "OTP validated successfully.");
//   } catch (error) {
//     console.error("Error validating OTP:", error);
//     return sendResponse(res, 500, "Server error.");
//   }
// };

module.exports = {
  generateOtp,
  sendOTP,
//   validateOTP,
};
