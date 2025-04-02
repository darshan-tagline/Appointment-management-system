const Medicine = require("../model/medicineModel");

const findMedicine = async (data) => {
  return Medicine.findOne(data);
};

const addNewMedicine = async (data) => {
  return Medicine.create(data);
};

const removeMedicine = async (id) => {
  return Medicine.findByIdAndDelete(id);
};

const modifyMedicine = async (id, medicine) => {
  return Medicine.findByIdAndUpdate(id, medicine, {
    new: true,
    runValidators: true,
  });
};

const searchMedicine = async (data) => {
  const page = Number(data.page) || 1;
  const limit = Number(data.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Medicine.aggregate([
    {
      $match: {
        ...(data.search && {
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { price: Number(data.search) },
          ],
        }),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        metadata: [{ $count: "totalDocuments" }],
        medicines: [{ $skip: skip }, { $limit: limit }],
      },
    },
    {
      $project: {
        totalDocuments: { $arrayElemAt: ["$metadata.totalDocuments", 0] },
        medicines: 1,
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
    medicines: result[0]?.medicines || [],
  };
};

module.exports = {
  findMedicine,
  addNewMedicine,
  removeMedicine,
  searchMedicine,
  modifyMedicine,
};
