const Category = require("../models/category.model");

// CREATE
const create = (data) => {
  return Category.create(data);
};

// FIND BY NAME WITHIN SAME PARENT
const findByName = (name, parentCategory = null, excludeId = null) => {
  const filter = {
    name: {
      $regex: `^${name}$`,
      $options: "i",
    },
    parentCategory: parentCategory || null,
  };

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  return Category.findOne(filter);
};

// FIND BY SLUG WITHIN SAME PARENT
const findBySlug = (slug, parentCategory = null, excludeId = null) => {
  const filter = {
    slug: slug.toLowerCase(),
    parentCategory: parentCategory || null,
  };

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  return Category.findOne(filter);
};

// FIND BY ID
const findById = (id) => {
  return Category.findById(id);
};

// GET ACTIVE CATEGORIES
const getAll = () => {
  return Category.find({
    isActive: true,
  })
    .populate({
      path: "parentCategory",
      select: "name slug",
    })
    .sort({ createdAt: -1 });
};

// GET CHILD CATEGORIES
const getChildren = (parentId) => {
  return Category.find({
    parentCategory: parentId,
    isActive: true,
  }).sort({ name: 1 });
};

// CHECK CHILD CATEGORIES
const hasChildren = (parentId) => {
  return Category.exists({
    parentCategory: parentId,
    isActive: true,
  });
};

// UPDATE
const updateById = (id, data) => {
  return Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// SOFT DELETE
const softDelete = (id) => {
  return Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

module.exports = {
  create,
  findByName,
  findBySlug,
  findById,
  getAll,
  getChildren,
  hasChildren,
  updateById,
  softDelete,
};