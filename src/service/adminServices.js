const mongoose = require("mongoose");
const { Admin } = require("../model/adminModel");

const findAdminByEmail = async (email) => {
  return Admin.findOne({ email });
};

module.exports = { findAdminByEmail };