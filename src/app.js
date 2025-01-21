const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("../config/db");
const  sendResponse  = require("./utils/responseUtils");

const router = require("./routes/router");
const port = process.env.PORT || 3000;
app.use(express.json());

app.use("/api", router);

app.use("*", (req, res) => {
  sendResponse(res, 404, "Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  sendResponse(res, 500, err.message);
});

// createAdmin();
connectDB();
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
