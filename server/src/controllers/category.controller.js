const categoryService = require("../services/category.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const createCategory = asyncHandler(async (req, res) => {

    const payload = {
        ...req.body,
    };

    if (req.file) {
        payload.image = req.file.filename;
    }

    const category = await categoryService.createCategory(payload);

    res.status(201).json(
        new ApiResponse(
            201,
            "Category created successfully",
            category
        )
    );
});

const getAllCategories = asyncHandler(async (req, res) => {

    const categories =
        await categoryService.getAllCategories();

    res.status(200).json(
        new ApiResponse(
            200,
            "Categories fetched successfully",
            categories
        )
    );
});

const getCategoryById = asyncHandler(async (req, res) => {

    const category =
        await categoryService.getCategoryById(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Category fetched successfully",
            category
        )
    );
});

const updateCategory = asyncHandler(async (req, res) => {

    const payload = {
        ...req.body,
    };

    if (req.file) {
        payload.image = req.file.filename;
    }

    const category =
        await categoryService.updateCategory(
            req.params.id,
            payload
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Category updated successfully",
            category
        )
    );
});

const deleteCategory = asyncHandler(async (req, res) => {

    await categoryService.deleteCategory(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Category deleted successfully"
        )
    );
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};