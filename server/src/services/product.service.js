// server/src/services/product.service.js

const ProductRepository = require("../repositories/product.repository");

const createProduct = async (productData) => {
  return await ProductRepository.create(productData);
};

const getAllProducts = async () => {
  return await ProductRepository.findAll();
};

const getProductById = async (id) => {
  return await ProductRepository.findById(id);
};

const updateProduct = async (id, updatedData) => {
  return await ProductRepository.updateById(id, updatedData);
};

const deleteProduct = async (id) => {
  return await ProductRepository.deleteById(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};