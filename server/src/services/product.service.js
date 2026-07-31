const Product = require("../models/product");

// ============================
// Create Product
// ============================
const createProduct = async (productData) => {
  return await Product.create(productData);
};

// ============================
// Get All Products
// ============================
const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

// ============================
// Get Product By ID
// ============================
const getProductById = async (id) => {
  return await Product.findById(id);
};

// ============================
// Update Product
// ============================
const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// ============================
// Delete Product
// ============================
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};