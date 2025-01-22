const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findPatientByVal, addNewPatient } = require('../service/patientServices'); 

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: '631794870163-5taui1e34smue4qrri1nota6v5758lhc.apps.googleusercontent.com', 
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/api/patient/auth/google/callback',
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
