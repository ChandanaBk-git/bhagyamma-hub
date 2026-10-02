
const mongoose = require("mongoose");

const productRepository =
  require("../repositories/product.repository");

const Category = require("../models/category.model");

/* =========================================================
   REMOVE INVENTORY STOCK
========================================================= */

const removeStockField = (productData = {}) => {
  const cleanData = {
    ...productData,
  };

  delete cleanData.stock;

  return cleanData;
};

/* =========================================================
   VALIDATE PARENT CATEGORY
========================================================= */

const validateParentCategory = async (parentCategoryId) => {
  if (!parentCategoryId) {
    throw new Error("Please select a parent category.");
  }

  if (!mongoose.Types.ObjectId.isValid(parentCategoryId)) {
    throw new Error("Invalid parent category ID.");
  }

  const parentCategory = await Category.findOne({
    _id: parentCategoryId,
    parentCategory: null,
    isActive: true,
  }).select("_id name");

  if (!parentCategory) {
    throw new Error(
      "Selected parent category does not exist or is inactive."
    );
  }

  return parentCategory;
};

/* =========================================================
   VALIDATE CHILD CATEGORIES
========================================================= */

const validateCategories = async (
  categories,
  parentCategoryId
) => {
  if (!Array.isArray(categories)) {
    throw new Error("Categories must be an array.");
  }

  const uniqueIds = [
    ...new Set(
      categories.map((id) => String(id).trim())
    ),
  ];

  if (uniqueIds.length === 0) {
    throw new Error("Select at least one subcategory.");
  }

  const invalidIds = uniqueIds.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidIds.length > 0) {
    throw new Error("One or more category IDs are invalid.");
  }

  const validCategories = await Category.find({
    _id: { $in: uniqueIds },
    parentCategory: parentCategoryId,
    isActive: true,
  }).select("_id name parentCategory");

  if (validCategories.length !== uniqueIds.length) {
    throw new Error(
      "One or more selected subcategories are invalid, inactive, or do not belong to the selected parent."
    );
  }

  return validCategories;
};

/* =========================================================
   VALIDATE PRODUCT CATEGORY STRUCTURE
========================================================= */

const validateProductCategories = async (productData) => {
  const parentCategory = await validateParentCategory(
    productData.parentCategory
  );

  const categories = await validateCategories(
    productData.categories,
    parentCategory._id
  );

  productData.parentCategory = parentCategory._id;

  productData.categories = categories.map(
    (category) => category._id
  );

  // Maintain legacy category field
  productData.category = parentCategory.name;

  return productData;
};

/* =========================================================
   CREATE PRODUCT
========================================================= */

const createProduct = async (productData) => {
  const cleanData = removeStockField(productData);

  await validateProductCategories(cleanData);

  return await productRepository.create(cleanData);
};

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

const getAllProducts = async (options = {}) => {
  const filter = {};

  if (options.activeOnly) {
    filter.status = "Active";
  }

  if (options.status) {
    filter.status = options.status;
  }

  // Parent category filter
  if (options.parentCategory) {
    if (
      !mongoose.Types.ObjectId.isValid(
        options.parentCategory
      )
    ) {
      throw new Error("Invalid parent category ID.");
    }

    filter.parentCategory = options.parentCategory;
  }

  // Child category filter
  if (options.category) {
    if (
      !mongoose.Types.ObjectId.isValid(options.category)
    ) {
      throw new Error("Invalid child category ID.");
    }

    filter.category = options.category;
  }

  // Minimum price
  if (options.minPrice !== undefined && options.minPrice !== "") {
    const minPrice = Number(options.minPrice);

    if (!Number.isFinite(minPrice) || minPrice < 0) {
      throw new Error("Invalid minimum price.");
    }

    filter.minPrice = minPrice;
  }

  // Maximum price
  if (options.maxPrice !== undefined && options.maxPrice !== "") {
    const maxPrice = Number(options.maxPrice);

    if (!Number.isFinite(maxPrice) || maxPrice < 0) {
      throw new Error("Invalid maximum price.");
    }

    filter.maxPrice = maxPrice;
  }

  if (
    filter.minPrice !== undefined &&
    filter.maxPrice !== undefined &&
    filter.minPrice > filter.maxPrice
  ) {
    throw new Error(
      "Minimum price cannot be greater than maximum price."
    );
  }

  // Search
  if (options.search && String(options.search).trim()) {
    filter.search = String(options.search).trim();
  }

  return await productRepository.findAll(filter);
};

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

const getProductById = async (id) => {
  return await productRepository.findById(id);
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

const updateProduct = async (id, data) => {
  const cleanData = removeStockField(data);

  if (
    cleanData.parentCategory !== undefined ||
    cleanData.categories !== undefined
  ) {
    const existingProduct =
      await productRepository.findById(id);

    if (!existingProduct) {
      return null;
    }

    const parentCategoryId =
      cleanData.parentCategory !== undefined
        ? cleanData.parentCategory
        : existingProduct.parentCategory?._id ||
          existingProduct.parentCategory;

    const categories =
      cleanData.categories !== undefined
        ? cleanData.categories
        : existingProduct.categories.map((item) =>
            String(item._id || item)
          );

    cleanData.parentCategory = parentCategoryId;
    cleanData.categories = categories;

    await validateProductCategories(cleanData);
  }

  return await productRepository.updateById(
    id,
    cleanData
  );
};

/* =========================================================
   DELETE PRODUCT
========================================================= */

const deleteProduct = async (id) => {
  return await productRepository.deleteById(id);
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};