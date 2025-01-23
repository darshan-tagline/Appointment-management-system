const jwt = require("jsonwebtoken");

const tokenGeneration = (data, expiresIn = "1d") => {
  return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn });
};

const tokenVarification = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const tokenDecode = (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
};
module.exports = { tokenGeneration, tokenVarification, tokenDecode };
