const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("../config/db");
const cookieSession = require("cookie-session");
const passport = require("passport");
const sendResponse = require("./utils/responseUtils");
const router = require("./routes/router");
const passportUtils = require('./utils/passportUtils');
connectDB();
// createAdmin();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    keys: [process.env.SESSION_SECRET],  // Use a session secret stored in .env file
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", router);

app.use("*", (req, res) => {
  sendResponse(res, 404, "Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  sendResponse(res, 500, err.message);
});

app.listen(port, () => console.log(`Server is connected`));
