const sendResponse = require("../utils/responseUtils");
const { tokenVarification } = require("../utils/token");
const adminvalidatorSchema = require("../validators/adminValidation");

const validateAdmin = (req, res, next) => {
  const { error } = adminvalidatorSchema.validate(req.body);

  if (error) {
    return sendResponse(res, 400, "validation failed", null, error.details);
  }
  next();
};

const authorizeAdmin = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (req.user.email !== adminEmail) {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not authorized as an admin." });
  }
  next();
};

module.exports = { validateAdmin, authorizeAdmin };
