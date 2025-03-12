const bcrypt = require("bcrypt");

const passwordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const passwordCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  passwordHash,
  passwordCompare,
};
