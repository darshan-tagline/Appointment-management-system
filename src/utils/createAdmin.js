const mongoose = require("mongoose");
const {
  findUserByEmailAndRole,
  addNewUser,
} = require("../service/userServices");
const { passwordHash } = require("./passwordUtils");
const sendResponse = require("./responseUtils");

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const existingAdmin = await findUserByEmailAndRole({
      email,
      role: "admin",
    });
    if (existingAdmin) {
      return sendResponse(null, 400, "Admin already exists");
    }
    const hashedPassword = await passwordHash(password);

    const admin = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    return sendResponse(null, 200, "Admin created successfully", admin);
  } catch (err) {
    console.error("Error while creating admin:", err);
    return sendResponse(null, 500, "Server error");
  }
};

module.exports = createAdmin;
