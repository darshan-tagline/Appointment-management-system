const jwt = require("jsonwebtoken");

const tokenGeneration = (payload, expiresIn = "1d") => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn });
};

const tokenVarification = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { tokenGeneration, tokenVarification };
