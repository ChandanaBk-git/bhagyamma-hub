
const ProductService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// =================================================
// PARSE MULTIPLE CATEGORY IDS
// =================================================

const parseCategories = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  let categories = value;

  if (typeof categories === "string") {
    try {
      categories = JSON.parse(categories);
    } catch {
      throw new ApiError(
        400,
        "Categories must be a valid JSON array."
      );
    }
  }

  if (!Array.isArray(categories)) {
    throw new ApiError(
      400,
      "Categories must be an array."
    );
  }

  return [
    ...new Set(
      categories.map((id) => String(id).trim())
    ),
  ];
};

// =================================================
// PARSE PARENT CATEGORY
// =================================================

const parseParentCategory = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return String(value).trim();
};

// =================================================
// CLOUDINARY IMAGE UPLOAD
// =================================================

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(
        new ApiError(400, "Uploaded image file is missing.")
      );
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `bhagyamma-hub/${folder}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
};

// =================================================
// UPLOAD MULTIPLE PRODUCT IMAGES
// =================================================

const uploadProductImages = async (files = []) => {
  const uploadedImages = [];

  for (const file of files) {
    const imageUrl = await uploadToCloudinary(
      file,
      "products"
    );

    uploadedImages.push(imageUrl);
  }

  return uploadedImages;
};

// =================================================
// CREATE PRODUCT
// =================================================

const createProduct = asyncHandler(async (req, res) => {
  const images = await uploadProductImages(req.files || []);

  const parentCategory = parseParentCategory(
    req.body.parentCategory
  );

  const categories = parseCategories(
    req.body.categories
  );

  const product = await ProductService.createProduct({
    productName: req.body.productName,

    // Parent category
    ...(parentCategory !== undefined && {
      parentCategory,
    }),

    // Child categories
    ...(categories !== undefined && {
      categories,
    }),

    // Legacy field for compatibility
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

// =================================================
// GET ALL PRODUCTS
// =================================================

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts({
    activeOnly: req.query.active === "true",
    status: req.query.status,

    // Category filters
    parentCategory: req.query.parentCategory,
    category: req.query.category,

    // Price filters
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,

    // Search
    search: req.query.search,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Products fetched successfully.",
      products
    )
  );
});

// =================================================
// GET PRODUCT BY ID
// =================================================

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

// =================================================
// UPDATE PRODUCT
// =================================================

const updateProduct = asyncHandler(async (req, res) => {
  const updatedData = {
    ...req.body,
  };

  const parentCategory = parseParentCategory(
    req.body.parentCategory
  );

  const categories = parseCategories(
    req.body.categories
  );

  if (parentCategory !== undefined) {
    updatedData.parentCategory = parentCategory;
  }

  if (categories !== undefined) {
    updatedData.categories = categories;
  }

  if (req.files && req.files.length > 0) {
    updatedData.images = await uploadProductImages(req.files);
  }

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

// =================================================
// DELETE PRODUCT
// =================================================

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