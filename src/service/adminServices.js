const  Admin  = require("../model/adminModel");

const findAdmin = async (data) => {
console.log(data);

  return Admin.findOne(data);
};

module.exports =  findAdmin ;