const express = require("express");

const router = express.Router();

const controller = require("../controllers/category.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const validate = require("../middleware/validate.middleware");

const upload = require("../middleware/upload.middleware");

const {
    categoryValidation,
} = require("../validations/category.validation");

router.get("/", controller.getAllCategories);

router.get("/:id", controller.getCategoryById);

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    categoryValidation,
    validate,
    controller.createCategory
);

router.put(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    categoryValidation,
    validate,
    controller.updateCategory
);

router.delete(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deleteCategory
);

module.exports = router;