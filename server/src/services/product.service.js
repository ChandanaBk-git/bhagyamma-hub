const productRepository = require("../repositories/product.repository");

// ============================
// Create Product
// ============================
const createProduct = async (productData) => {
  return await productRepository.create(productData);
};

// ============================
// Get All Products
// ============================
const getAllProducts = async (options = {}) => {
  const filter = {};

  if (options.activeOnly) {
    filter.status = "Active";
  }

  if (options.status) {
    filter.status = options.status;
  }

  return await productRepository.findAll(filter);
};

// ============================
// Get Product By ID
// ============================
const getProductById = async (id) => {
  return await productRepository.findById(id);
};

// ============================
// Update Product
// ============================
const updateProduct = async (id, data) => {
  return await productRepository.updateById(id, data);
};

// ============================
// Delete Product
// ============================
const deleteProduct = async (id) => {
  return await productRepository.deleteById(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};