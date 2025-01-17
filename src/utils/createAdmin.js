const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { Admin } = require("../model/adminModel");
const { findAdminByEmail } = require("../service/adminServices");

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    await mongoose.connect(process.env.MONGO_URL);
    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      console.log("Admin already exists.");
      mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin created successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error while creating admin:", err);
  }
};

module.exports = { createAdmin };
