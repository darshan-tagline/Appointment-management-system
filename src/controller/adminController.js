const sendResponse = require("../utils/responseUtils");
const { tokenGeneration } = require("../utils/token");
const findAdmin = require("../service/adminServices");
const { passwordCompare } = require("../utils/passwordUtils");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdmin({ email });
    if (!admin) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const isPasswordMatch = await passwordCompare(password, admin.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    const token = tokenGeneration(process.env.ADMIN_EMAIL);
    return sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = {
  adminLogin,
};
