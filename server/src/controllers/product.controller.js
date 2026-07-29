const ProductService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    category,
    brand,
    description,
    benefits,
    ingredients,
    mrp,
    sellingPrice,
    stock,
    status,
  } = req.body;

  const images = req.files
    ? req.files.map((file) => `/uploads/products/${file.filename}`)
    : [];

  const product = await ProductService.createProduct({
    productName,
    category,
    brand,
    description,
    benefits,
    ingredients,
    mrp,
    sellingPrice,
    stock,
    status,
    images,
  });

  

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully."));
});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts();

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully."));
});

// Get Product By ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully."));
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const updatedData = { ...req.body };

  if (req.files && req.files.length > 0) {
    updatedData.images = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );
  }

  const product = await ProductService.updateProduct(
    req.params.id,
    updatedData
  );

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully."));
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.deleteProduct(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully."));
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};