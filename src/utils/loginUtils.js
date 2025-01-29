const sendResponse = require("../utils/responseUtils");
const { findUser } = require("../service/userServices");
const { passwordCompare } = require("../utils/passwordUtils");
const { tokenGeneration } = require("../utils/token");

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await findUser({ email, role });
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    if (role === "patient" && user.isVerified === false) {
      return sendResponse(
        res,
        401,
        "Account not verified. Please verify your email."
      );
    }

    const isPasswordMatch = await passwordCompare(password, user.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const accessToken = tokenGeneration(
      { id: user._id, role: user.role },
      "7d"
    );

    return sendResponse(res, 200, "Login successful", { accessToken });
  } catch (error) {
    console.log("Server Error", error);
    return sendResponse(res, 500, "Server error");
  }
};

module.exports = login;
