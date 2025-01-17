const jwt = require("jsonwebtoken");

const tokenGeneration = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const tokenVarification = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
module.exports = { tokenGeneration, tokenVarification };
