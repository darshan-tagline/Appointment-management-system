const User = require("../model/userModel");

const findUser = async (criteria) => {
  return User.findOne(criteria);
};

const addNewUser = async (user) => {
  return User.create(user);
};

const searchUser = async (role, data) => {
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;
  const result = await User.aggregate([
    {
      $match: {
        role,
        ...(data.name && { name: { $regex: data.name, $options: "i" } }),
        ...(data.email && { email: { $regex: data.email, $options: "i" } }),
      },
    },
    {
      $facet: {
        metadata: [{ $count: "totalDocuments" }],
        doctors: [{ $skip: skip }, { $limit: limit }],
      },
    },
    {
      $project: {
        totalDocuments: { $arrayElemAt: ["$metadata.totalDocuments", 0] },
        doctors: 1,
      },
    },
  ]);
  const totalDocuments = result[0]?.totalDocuments || 0;
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    pagination: {
      page,
      limit,
      totalDocuments,
      totalPages,
    },
    doctors: result[0]?.doctors || [],
  };
};

const updateUser = async (query, updates) => {
  return User.findOneAndUpdate(query, updates, { new: true });
};

const removeUser = async (removeData) => {
  return User.findByIdAndDelete(removeData);
};
module.exports = { findUser, addNewUser, searchUser, updateUser, removeUser };
