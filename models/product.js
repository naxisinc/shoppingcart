const mongoose = require("mongoose");

// Product Schema
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = (module.exports = mongoose.model("Product", ProductSchema));
