const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { tokenGeneration } = require("./token");
const { findUser, addNewUser } = require("../service/userServices");

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

        let patient = await findUser({ email, role: "patient" });
        if (patient) {
          const token = tokenGeneration(patient._id, "1d");
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
