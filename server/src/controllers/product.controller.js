const ProductService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");

// =======================================
// Create Product
// =======================================
// =======================================
// Create Product
// =======================================
const createProduct = asyncHandler(async (req, res) => {
  console.log("========== CREATE PRODUCT ==========");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "bhagyamma-hub/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });

      images.push(result.secure_url);
    }
  }

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
  const updatedData = {
    ...req.body,
  };

  if (req.files && req.files.length > 0) {
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "bhagyamma-hub/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });

      uploadedImages.push(result.secure_url);
    }

    updatedData.images = uploadedImages;
  }

  updatedData.price = Number(updatedData.price);

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

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};