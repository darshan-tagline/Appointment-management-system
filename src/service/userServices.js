const User = require("../model/userModel");

const findUser = async (criteria) => {
  try {
    return User.findOne(criteria);
  } catch (error) {
    console.error("Error while finding user:", error);
    return null;
  }
};

const addNewUser = async (user) => {
  try {
    return User.create(user);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const searchUser = async (role, data) => {
  try {
    const query = { role };
    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 10;
    const skip = (page - 1) * limit;

    data.name && (query.name = { $regex: data.name, $options: "i" });
    data.email && (query.email = { $regex: data.email, $options: "i" });

    return User.aggregate([
      {
        $match: query,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const updateUser = async (query, updates) => {
  try {
    return User.findOneAndUpdate(query, updates, { new: true });
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const removeUser = async (removeData) => {
  try {
    return User.findByIdAndDelete(removeData);
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
module.exports = { findUser, addNewUser, searchUser, updateUser, removeUser };
