const bcrypt = require("bcrypt");

const passwordHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const passwordCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  passwordHash,
  passwordCompare,
};
