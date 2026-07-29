const Category = require("../models/category.model");

const create = (data) => Category.create(data);

const findByName = (name) => Category.findOne({ name });

const findBySlug = (slug) => Category.findOne({ slug });

const findById = (id) => Category.findById(id);

const getAll = () =>
  Category.find({ isActive: true }).sort({ createdAt: -1 });

const updateById = (id, data) =>
  Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

const softDelete = (id) =>
  Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

module.exports = {
  create,
  findByName,
  findBySlug,
  findById,
  getAll,
  updateById,
  softDelete,
};