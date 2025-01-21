const jwt = require("jsonwebtoken");

const tokenGeneration = (data) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const tokenVarification = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
module.exports = { tokenGeneration, tokenVarification };
