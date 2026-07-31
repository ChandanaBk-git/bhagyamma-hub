const ProductService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// =======================================
// Create Product
// =======================================
const createProduct = asyncHandler(async (req, res) => {
  console.log("========== CREATE PRODUCT ==========");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const images = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      images.push(`/uploads/products/${file.filename}`);
    });
  }

  const product = await ProductService.createProduct({
    productName: req.body.productName,
    category: req.body.category,
    brand: req.body.brand,
    description: req.body.description,
    benefits: req.body.benefits,
    ingredients: req.body.ingredients,
    mrp: Number(req.body.mrp),
    sellingPrice: Number(req.body.sellingPrice),
    status: req.body.status,
    images,
  });

  return res
    .status(201)
    .json(new ApiResponse(
  201,
  "Product created successfully.",
  product
));
});

// =======================================
// Get All Products
// =======================================
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts();

  return res.status(200).json(
new ApiResponse(
  200,
  "Products fetched successfully.",
  products
)
  );
});

// =======================================
// Get Product By ID
// =======================================
const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

return res.status(200).json(
  new ApiResponse(
    200,
    "Product fetched successfully.",
    product
  )
);
});

// =======================================
// Update Product
// =======================================
const updateProduct = asyncHandler(async (req, res) => {
  const updatedData = {
    ...req.body,
  };

  if (req.files && req.files.length > 0) {
    updatedData.images = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );
  }

  updatedData.mrp = Number(updatedData.mrp);
  updatedData.sellingPrice = Number(updatedData.sellingPrice);
  updatedData.stock = Number(updatedData.stock);

  const product = await ProductService.updateProduct(
    req.params.id,
    updatedData
  );

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product updated successfully.",
      product
    )
  );
});

// =======================================
// Delete Product
// =======================================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.deleteProduct(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product deleted successfully.",
      null
    )
  );
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};