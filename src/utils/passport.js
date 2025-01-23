const { OAuth2Client } = require("google-auth-library");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  findPatientByVal,
  addNewPatient,
} = require("../service/patientServices");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/patient/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let patient = await findPatientByVal({ email });
        if (!patient) {
          const patientData = {
            name: profile.displayName,
            email,
            password: null,
            refreshToken,
          };
          patient = await addNewPatient(patientData);
        }
        const userWithTokens = {
          ...patient.toObject(),
          accessToken,
          refreshToken,
        };

        return done(null, userWithTokens);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

const refreshAccessToken = async (refreshToken, user) => {
  try {
    if (user.password === null) {
      const oauth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
      );

      oauth2Client.setCredentials({ refresh_token: refreshToken });

      const newTokens = await oauth2Client.refreshAccessToken();
      return newTokens.credentials;
    } else {
      const newAccessToken = tokenGeneration(user._id, "1d");
      const newRefreshToken = tokenGeneration(user._id, "7d");
      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    }
  } catch (error) {
    console.error("Failed to refresh access token", error);
    throw error;
  }
};
module.exports = {
  refreshAccessToken,
};
