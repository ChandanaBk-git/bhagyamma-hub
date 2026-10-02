
const Product = require("../models/product");

// =================================================
// CREATE PRODUCT
// =================================================

const create = async (productData) => {
  return await Product.create(productData);
};

// =================================================
// GET ALL PRODUCTS WITH FILTERS
// =================================================

const findAll = async (filter = {}) => {
  const query = {};

  // Preserve status filtering
  if (filter.status) {
    query.status = filter.status;
  }

  // Parent category filter
  if (filter.parentCategory) {
    query.parentCategory = filter.parentCategory;
  }

  // Child category filter
  if (filter.category) {
    query.categories = filter.category;
  }

  // Minimum price
  if (filter.minPrice !== undefined) {
    query.price = {
      ...query.price,
      $gte: filter.minPrice,
    };
  }

  // Maximum price
  if (filter.maxPrice !== undefined) {
    query.price = {
      ...query.price,
      $lte: filter.maxPrice,
    };
  }

  // Product search
  if (filter.search) {
    const searchRegex = new RegExp(
      filter.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    query.$or = [
      { productName: searchRegex },
      { brand: searchRegex },
      { description: searchRegex },
    ];
  }

  return await Product.find(query)
    .populate("parentCategory", "name slug")
    .populate("categories", "name slug parentCategory")
    .sort({ createdAt: -1 });
};

// =================================================
// GET PRODUCT BY ID
// =================================================

const findById = async (id) => {
  return await Product.findById(id)
    .populate("parentCategory", "name slug")
    .populate("categories", "name slug parentCategory");
};

// =================================================
// UPDATE PRODUCT
// =================================================

const updateById = async (id, updatedData) => {
  return await Product.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("parentCategory", "name slug")
    .populate("categories", "name slug parentCategory");
};

// =================================================
// DELETE PRODUCT
// =================================================

const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// =================================================
// EXPORTS
// =================================================

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};