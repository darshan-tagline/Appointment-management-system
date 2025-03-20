const User = require("../model/userModel");
const { userRole } = require("../utils/comman");
const sendResponse = require("../utils/responseUtils");

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
        users: [{ $skip: skip }, { $limit: limit }],
      },
    },
    {
      $set: {
        totalDocuments: { $arrayElemAt: ["$metadata.totalDocuments", 0] },
      },
    },
    {
      $unset: ["metadata", "users.otp", "users.otpExpires", "users.password"],
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
    users: result[0]?.users || [],
  };
};

const updateUser = async (query, updates) => {
  return User.findOneAndUpdate(query, updates, { new: true });
};

const removeUser = async (removeData) => {
  return User.findByIdAndDelete(removeData);
};

const findAllPatient = async (req, res) => {
  const queryParams = req.query;
  const allPatient = await searchUser(userRole.PATIENT, queryParams);
  console.log(allPatient);

  if (!allPatient) return sendResponse(res, 204, "No patient found");
  return sendResponse(res, 200, "All patient", allPatient);
};
module.exports = {
  findUser,
  addNewUser,
  searchUser,
  updateUser,
  removeUser,
  findAllPatient,
};
