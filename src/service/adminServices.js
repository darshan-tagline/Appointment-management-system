const mongoose = require("mongoose");
const  Admin  = require("../model/adminModel");

const findAdminByEmail = async (data) => {
  return Admin.findOne(data);
};

module.exports =  findAdminByEmail ;