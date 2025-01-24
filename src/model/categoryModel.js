const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [50, "Category name cannot be longer than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      maxlength: [255, "Description cannot be longer than 255 characters"],
    },
  },

  { versionKey: false, timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
