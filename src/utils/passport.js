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
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let patient = await findPatientByVal({ email });
        if (!patient) {
          const patientData = {
            name: profile.displayName,
            email,
            password: null,
          };
          patient = await addNewPatient(patientData);
        }

        return done(null, patient);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
