const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  findPatientByVal,
  addNewPatient,
} = require("../service/patientServices");
const { tokenGeneration } = require("./token");

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
      accessType: "offline",
      prompt: "consent",
      passReqToCallback: true,
    },
    async (req, at, rt, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const alreadyExists = await findPatientByVal({ email });
        if (alreadyExists) {
          return done(null, "User already exists");
        }

        let patient = await findPatientByVal({ email });
        if (!patient) {
          const patientData = {
            name: profile.displayName,
            email,
            password: null,
            
          };
          patient = await addNewPatient(patientData);
        }

        const accessToken = tokenGeneration(patient._id, "1d");

        const userWithTokens = {
          ...patient.toObject(),
          accessToken,
     
        };

        return done(null, userWithTokens);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
