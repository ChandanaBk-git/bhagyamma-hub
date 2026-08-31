const ProductService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");

// =======================================
// Upload image to Cloudinary
// =======================================
const uploadToCloudinary = async (file) => {
  if (!file || !file.path) {
    throw new ApiError(400, "Uploaded image file is missing.");
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "bhagyamma-hub/products",
    resource_type: "image",
  });

  return result.secure_url;
};

// =======================================
// Create Product
// =======================================
const createProduct = asyncHandler(async (req, res) => {
  console.log("========== CREATE PRODUCT ==========");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const images = [];

  // Upload images to Cloudinary
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const imageUrl = await uploadToCloudinary(file);
      images.push(imageUrl);
    }
  }

  console.log("CLOUDINARY IMAGES:", images);

  const product = await ProductService.createProduct({
    productName: req.body.productName,
    category: req.body.category,
    brand: req.body.brand,
    description: req.body.description,
    benefits: req.body.benefits,
    ingredients: req.body.ingredients,

    usage: req.body.usage,
    storage: req.body.storage,
    weight: req.body.weight,
    quantity: req.body.quantity,
    shelfLife: req.body.shelfLife,
    manufacturer: req.body.manufacturer,
    countryOfOrigin: req.body.countryOfOrigin,

    price: Number(req.body.price),

    status: req.body.status || "Active",

    images,
  });

  console.log("PRODUCT CREATED:", product);

  return res.status(201).json(
    new ApiResponse(
      201,
      "Product created successfully.",
      product
    )
  );
});

// =======================================
// Get All Products
// =======================================
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts({
    activeOnly: req.query.active === "true",
    status: req.query.status,
  });

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
  const product = await ProductService.getProductById(
    req.params.id
  );

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
  console.log("========== UPDATE PRODUCT ==========");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const updatedData = {
    ...req.body,
  };

  // Upload new images to Cloudinary
  if (req.files && req.files.length > 0) {
    const uploadedImages = [];

    for (const file of req.files) {
      const imageUrl = await uploadToCloudinary(file);
      uploadedImages.push(imageUrl);
    }

    updatedData.images = uploadedImages;
  }

  // Convert price to number
  if (updatedData.price !== undefined) {
    updatedData.price = Number(updatedData.price);
  }

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
  const product = await ProductService.deleteProduct(
    req.params.id
  );

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

// =======================================
// Exports
// =======================================
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};