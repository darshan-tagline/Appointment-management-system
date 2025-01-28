const sendResponse = require("../utils/responseUtils");
const { tokenGeneration } = require("../utils/token");
const { passwordCompare } = require("../utils/passwordUtils");
const { findUser } = require("../service/userServices");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email, role: "admin" });

    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const isPasswordMatch = await passwordCompare(password, user.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const token = tokenGeneration({ id: user._id, role: user.role }, "7d");

    return sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.log("error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = adminLogin;
