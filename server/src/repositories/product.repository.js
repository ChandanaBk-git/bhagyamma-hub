
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
// GET PRODUCT BY SEO SLUG
// =================================================

const findBySlug = async (slug) => {
  return await Product.findOne({ slug })
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


const backfillMissingSlugs = async (createSlug) => {
  const products = await Product.find({
    $or: [
      { slug: { $exists: false } },
      { slug: "" },
      { slug: null },
    ],
  }).select("_id productName slug");

  const results = [];

  for (const product of products) {
    const baseSlug = createSlug(product.productName);

    if (!baseSlug) {
      results.push({
        productId: String(product._id),
        status: "skipped",
        reason: "Product name cannot generate a slug",
      });
      continue;
    }

    let slug = baseSlug;
    let counter = 2;

    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    await Product.updateOne(
      { _id: product._id, $or: [
        { slug: { $exists: false } },
        { slug: "" },
        { slug: null },
      ] },
      { $set: { slug } }
    );

    results.push({
      productId: String(product._id),
      productName: product.productName,
      slug,
      status: "updated",
    });
  }

  return results;
};


// =================================================
// EXPORTS
// =================================================

module.exports = {
  create,
  findAll,
  findById,
  findBySlug,
  updateById,
  deleteById,
  backfillMissingSlugs,
};