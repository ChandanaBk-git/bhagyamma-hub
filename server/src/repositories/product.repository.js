// server/src/repositories/product.repository.js

const Product = require("../models/Product");

const create = async (productData) => {
  return await Product.create(productData);
};

const findAll = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await Product.findById(id);
};

const updateById = async (id, updatedData) => {
  return await Product.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
};

const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};