const categoryService = require("../services/category.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadCategoryImage = async (file) => {
    if (!file) return undefined;

    if (!file.buffer) {
        throw new ApiError(400, "Category image buffer is missing");
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "bhagyamma-hub/categories",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(
                        new ApiError(500, "Category image upload failed")
                    );
                }

                resolve(result.secure_url);
            }
        );

        Readable.from(file.buffer).pipe(uploadStream);
    });
};

const createCategory = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    if (req.file) {
        payload.image = await uploadCategoryImage(req.file);
    }

    const category = await categoryService.createCategory(payload);

    res.status(201).json(
        new ApiResponse(201, "Category created successfully", category)
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json(
        new ApiResponse(200, "Categories fetched successfully", categories)
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);

    res.status(200).json(
        new ApiResponse(200, "Category fetched successfully", category)
    );
});

const updateCategory = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    if (req.file) {
        payload.image = await uploadCategoryImage(req.file);
    }

    const category = await categoryService.updateCategory(
        req.params.id,
        payload
    );

    res.status(200).json(
        new ApiResponse(200, "Category updated successfully", category)
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);

    res.status(200).json(
        new ApiResponse(200, "Category deleted successfully")
    );
});

const getCategoryTree = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategoryTree();

    res.status(200).json(
        new ApiResponse(
            200,
            "Category tree fetched successfully",
            categories
        )
    );
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoryTree,
};