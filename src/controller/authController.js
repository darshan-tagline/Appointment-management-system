const passport = require("passport");
const sendResponse = require("../utils/responseUtils");
const { passwordCompare } = require("../utils/passwordUtils");
const { tokenGeneration } = require("../utils/token");
const { sendOTP } = require("../utils/otpUtils");
const { passwordHash } = require("../utils/passwordUtils");
const { findUser, updateUser, addNewUser } = require("../service/userServices");
const { userRole } = require("../utils/comman");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email });
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    if (user.isVerified === false) {
      return sendResponse(
        res,
        401,
        "Account not verified. Please verify your email."
      );
    }

    const isPasswordMatch = await passwordCompare(password, user.password);

    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const accessToken = tokenGeneration(
      { id: user._id, role: user.role },
      "7d"
    );

    return sendResponse(res, 200, "Login successful", {
      accessToken,
      role: user.role,
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login:>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const patientSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const alreadyExists = await findUser({ email });
    if (alreadyExists) {
      return sendResponse(res, 400, "Patient already exists");
    }
    const hashedPassword = await passwordHash(password);
    const patient = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: userRole.PATIENT,
      isVerified: false,
    });

    await sendOTP(patient.email);
    return sendResponse(res, 201, "OTP sent successfully.");
  } catch (error) {
    console.log("Error in patient sign up:>>>>", error);
    return sendResponse(res, 500, "Server error");
  }
};

const validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const patient = await findUser({ email });
    if (!patient) {
      return sendResponse(res, 404, "User not found.");
    }
    if (new Date() > patient.otpExpires) {
      return sendResponse(res, 400, "OTP has expired.");
    }

    if (patient.otp !== otp) {
      return sendResponse(res, 400, "Invalid OTP.");
    }

    await updateUser(
      { email },
      {
        isVerified: true,
        otp: null,
        otpExpires: null,
      }
    );
    const accessToken = tokenGeneration(
      { id: patient._id, role: patient.role },
      "7d"
    );

    return sendResponse(res, 200, "OTP validated successfully.", {
      accessToken,
      role: patient.role,
      name: patient.name,
      _id: patient._id,
      email: patient.token,
    });
  } catch (error) {
    console.error("Error validating OTP:>>>>>", error);
    return sendResponse(res, 500, "Server error.");
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await findUser({ email });
    if (!patient) {
      return sendResponse(res, 404, "User not found.");
    }
    const currentTime = new Date();
    if (patient.otpExpires && currentTime < new Date(patient.otpExpires)) {
      return sendResponse(
        res,
        400,
        "You can request OTP again after some time."
      );
    }
    await sendOTP(patient.email);
    return sendResponse(res, 200, "OTP resent successfully.");
  } catch (error) {
    console.error("Error resending OTP:>>>>>", error);
    return sendResponse(res, 500, "Server error.");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await findUser({ email });
    if (!patient) {
      return sendResponse(res, 404, "User not found.");
    }
    await updateUser(
      { email },
      {
        isVerified: false,
      }
    );
    await sendOTP(patient.email);
    return sendResponse(res, 200, "OTP sent successfully.");
  } catch (error) {
    console.error("Error resending OTP:>>>>>", error);
    return sendResponse(res, 500, "Server error.");
  }
};

const forgotPasswordVarifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const patient = await findUser({ email, isVerified: false });
    if (!patient) {
      return sendResponse(res, 404, "User not found.");
    }
    if (new Date() > patient.otpExpires) {
      return sendResponse(res, 400, "OTP has expired.");
    }
    if (patient.otp !== otp) {
      return sendResponse(res, 400, "Invalid OTP.");
    }

    await updateUser(
      { email },
      {
        isVerified: true,
        otp: null,
        otpExpires: null,
      }
    );
    return sendResponse(res, 200, "OTP validated successfully.");
  } catch (error) {
    console.error("Error resending OTP:>>>>>", error);
    return sendResponse(res, 500, "Server error.");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await findUser({ email });
    if (!patient) {
      return sendResponse(res, 404, "User not found.");
    }
    if (patient.isVerified === false) {
      return sendResponse(
        res,
        400,
        "You are not verified. Please verify your OTP."
      );
    }
    const hashedPassword = await passwordHash(password);
    await updateUser(
      { email },
      {
        password: hashedPassword,
        otp: null,
        otpExpires: null,
      }
    );
    return sendResponse(res, 200, "Password reset successfully.");
  } catch (error) {
    console.error("Error resting password :>>>>>", error);
    return sendResponse(res, 500, "Server error.");
  }
};
const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const patient = await findUser({ email, role: req.user.role });
    if (!patient) {
      return sendResponse(res, 404, "User not found.");
    }
    const isPasswordMatch = await passwordCompare(
      oldPassword,
      patient.password
    );
    if (!isPasswordMatch) {
      return sendResponse(res, 400, "Invalid password.");
    }
    const hashedPassword = await passwordHash(newPassword);
    await updateUser(
      { email },
      {
        password: hashedPassword,
      }
    );
    return sendResponse(res, 200, "Password changed successfully.");
  } catch (error) {
    console.error("Error password chnaging :>>>>>", error);
    return sendResponse(res, 500, "Server error.");
  }
};

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
      accessType: "offline",
      prompt: "consent",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let patient = await findUser({ email });
        if (patient) {
          const token = tokenGeneration(patient._id, "7d");
          return done(null, { ...patient.toObject(), accessToken: token });
        }

        const newPatient = await addNewUser({
          name: profile.displayName,
          email,
          role: userRole.PATIENT,
          isVerified: true,
        });

        const token = tokenGeneration(
          { id: newPatient._id, role: userRole.PATIENT },
          "7d"
        );
        return done(null, { ...newPatient.toObject(), accessToken: token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
module.exports = {
  login,
  patientSignUp,
  validateOTP,
  resendOtp,
  forgotPassword,
  forgotPasswordVarifyOTP,
  changePassword,
  resetPassword,
};
