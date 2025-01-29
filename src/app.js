const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectDB = require("../config/db");
const passport = require("passport");
const sendResponse = require("./utils/responseUtils");
const router = require("./routes/router");
const passportConfig = require('./controller/authController')
const session = require("express-session");
const port = process.env.PORT || 3000;
// const createAdmin = require("./utils/createAdmin");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

connectDB();

// createAdmin();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.get("/", (req, res) => {
  return sendResponse(res, 200, "Server is online");
});

app.use("*", (req, res) => {
  return sendResponse(res, 404, "Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  return sendResponse(res, 500, err.message || "Server error");
});

app.listen(port, () =>
  console.log(`Server connected successfully and port is ${port}`)
);
