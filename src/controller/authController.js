const passport = require("passport");
const sendResponse = require("../utils/responseUtils");
const { passwordCompare } = require("../utils/passwordUtils");
const { tokenGeneration } = require("../utils/token");
const { sendOTP } = require("../utils/otpUtils");
const { passwordHash } = require("../utils/passwordUtils");
const { findUser, updateUser, addNewUser } = require("../service/userServices");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await findUser({ email, role });
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    if (role === "patient" && user.isVerified === false) {
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

    return sendResponse(res, 200, "Login successful", { accessToken });
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

    const hashedPassword =  passwordHash(password);
    const patient = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: "patient",
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
    const patient = await findUser({ email, role: "patient" });
    if (!patient) {
      return sendResponse(res, 404, "Patient not found.");
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
    });
  } catch (error) {
    console.error("Error validating OTP:>>>>>", error);
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
          role: "patient",
          isVerified: true,
        });

        const token = tokenGeneration(
          { id: newPatient._id, role: "patient" },
          "7d"
        );
        return done(null, { ...newPatient.toObject(), accessToken: token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
module.exports = { login, patientSignUp, validateOTP };
