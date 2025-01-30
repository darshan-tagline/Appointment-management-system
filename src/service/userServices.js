const User = require("../model/userModel");

const findUser = async (criteria) => {
  return User.findOne(criteria);
};

const addNewUser = async (user) => {
  return User.create(user);
};

const searchUser = async (role, data) => {
  const query = { role };
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;
  return User.aggregate([
    {
      $match: {
        role,
        ...(data.name && { name: { $regex: data.name, $options: "i" } }),
        ...(data.email && { email: { $regex: data.email, $options: "i" } }),
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
};

const updateUser = async (query, updates) => {
  return User.findOneAndUpdate(query, updates, { new: true });
};

const removeUser = async (removeData) => {
  return User.findByIdAndDelete(removeData);
};
module.exports = { findUser, addNewUser, searchUser, updateUser, removeUser };
