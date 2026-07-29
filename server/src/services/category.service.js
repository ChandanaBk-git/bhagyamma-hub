const categoryRepository = require("../repositories/category.repository");
const ApiError = require("../utils/ApiError");
const slugify = require("../utils/slugify");

const createCategory = async (payload) => {
    const { name, description, image } = payload;

    const categoryName = name.trim();
    const slug = slugify(categoryName);

    const existingCategory = await categoryRepository.findBySlug(slug);

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    return await categoryRepository.create({
        name: categoryName,
        slug,
        description,
        image,
    });
};

const getAllCategories = async () => {
    return await categoryRepository.getAll();
};

const getCategoryById = async (id) => {
    const category = await categoryRepository.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;
};

const updateCategory = async (id, payload) => {
    const category = await categoryRepository.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (payload.name) {
        payload.name = payload.name.trim();
        payload.slug = slugify(payload.name);
    }

    return await categoryRepository.updateById(id, payload);
};

const deleteCategory = async (id) => {
    const category = await categoryRepository.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return await categoryRepository.softDelete(id);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};