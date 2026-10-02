const mongoose = require("mongoose");

const categoryRepository = require("../repositories/category.repository");

const Category = require("../models/category.model");
const Product = require("../models/product");

const ApiError = require("../utils/ApiError");
const slugify = require("../utils/slugify");

// ==========================================
// VALIDATE PARENT CATEGORY
// ==========================================

const validateParentCategory = async (parentCategoryId) => {
    if (!parentCategoryId) {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(parentCategoryId)) {
        throw new ApiError(400, "Invalid parent category ID");
    }

    const parent = await Category.findOne({
        _id: parentCategoryId,
        isActive: true,
        parentCategory: null,
    });

    if (!parent) {
        throw new ApiError(
            400,
            "Selected parent category does not exist or is inactive"
        );
    }

    return parent;
};

// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (payload) => {
    const { name, description, image, parentCategory } = payload;

    if (!name || !name.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const categoryName = name.trim();
    const slug = slugify(categoryName);

    const existingCategory =
        await categoryRepository.findBySlug(slug);

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    let parentId = null;

    if (parentCategory) {
        const parent = await validateParentCategory(parentCategory);
        parentId = parent._id;
    }

    return categoryRepository.create({
        name: categoryName,
        slug,
        description: description || "",
        image: image || "",
        parentCategory: parentId,
    });
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================

const getAllCategories = async () => {
    return categoryRepository.getAll();
};

// ==========================================
// GET CATEGORY BY ID
// ==========================================

const getCategoryById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await categoryRepository.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

const updateCategory = async (id, payload) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await categoryRepository.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const updatedData = { ...payload };

    if (payload.name !== undefined) {
        const categoryName = payload.name.trim();

        if (!categoryName) {
            throw new ApiError(400, "Category name is required");
        }

        const newSlug = slugify(categoryName);

        const existingCategory =
            await categoryRepository.findBySlug(newSlug);

        if (
            existingCategory &&
            existingCategory._id.toString() !== id.toString()
        ) {
            throw new ApiError(409, "Category already exists");
        }

        updatedData.name = categoryName;
        updatedData.slug = newSlug;
    }

    if (payload.parentCategory !== undefined) {
        const parentId = payload.parentCategory || null;

        if (parentId && parentId.toString() === id.toString()) {
            throw new ApiError(
                400,
                "A category cannot be its own parent"
            );
        }

        if (parentId) {
            const parent = await validateParentCategory(parentId);
            updatedData.parentCategory = parent._id;
        } else {
            updatedData.parentCategory = null;
        }

        // Do not allow a category with children to become a child.
        const hasChildren = await Category.exists({
            parentCategory: id,
            isActive: true,
        });

        if (hasChildren && updatedData.parentCategory) {
            throw new ApiError(
                400,
                "A parent category with child categories cannot become a child"
            );
        }
    }

    return categoryRepository.updateById(id, updatedData);
};

// ==========================================
// DELETE CATEGORY
// ==========================================

const deleteCategory = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await categoryRepository.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Prevent deleting a parent that has active children.
    const hasChildren = await Category.exists({
        parentCategory: id,
        isActive: true,
    });

    if (hasChildren) {
        throw new ApiError(
            400,
            "Cannot delete this parent category. Delete or reassign its child categories first."
        );
    }

    // Prevent deleting a parent assigned to products.
    const hasParentProducts = await Product.exists({
        parentCategory: id,
    });

    if (hasParentProducts) {
        throw new ApiError(
            400,
            "Cannot delete this category because products are assigned to it."
        );
    }

    // Remove deleted child category from products.
    await Product.updateMany(
        { categories: id },
        {
            $pull: {
                categories: id,
            },
        }
    );

    // Preserve the existing legacy category field.
    return categoryRepository.softDelete(id);
};

// ==========================================
// GET PARENT AND CHILD CATEGORY TREE
// ==========================================

const getCategoryTree = async () => {
    const categories = await Category.find({
        isActive: true,
    })
        .select("_id name slug description image parentCategory isActive")
        .sort({ name: 1 })
        .lean();

    const parents = categories.filter(
        (category) => !category.parentCategory
    );

    return parents.map((parent) => ({
        ...parent,
        children: categories.filter(
            (category) =>
                category.parentCategory &&
                category.parentCategory.toString() ===
                    parent._id.toString()
        ),
    }));
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoryTree,
};