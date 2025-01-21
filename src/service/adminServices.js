const  Admin  = require("../model/adminModel");

const findAdmin = async (data) => {
  return Admin.findOne(data);
};

module.exports =  findAdmin ;