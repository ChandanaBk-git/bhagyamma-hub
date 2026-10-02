const express = require("express");

const router = express.Router();

const controller = require("../controllers/category.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const validate = require("../middleware/validate.middleware");

const categoryUpload = require(
  "../middleware/categoryUpload.middleware"
);

const {
    categoryValidation,
} = require("../validations/category.validation");

// Get category hierarchy
router.get("/tree", controller.getCategoryTree);

// Get all categories
router.get("/", controller.getAllCategories);

// Get category by ID
router.get("/:id", controller.getCategoryById);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  categoryUpload.single("image"),
  categoryValidation,
  validate,
  controller.createCategory
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  categoryUpload.single("image"),
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

router.get("/tree", controller.getCategoryTree);

module.exports = router;