const express = require("express");

const router = express.Router();

const controller = require("../controllers/product.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const upload = require("../middleware/upload.middleware");

const {
    productValidation,
} = require("../validations/product.validation");

router.get("/", controller.getAllProducts);

router.get("/:id", controller.getProductById);

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    upload.array("images", 5),
    productValidation,
    validate,
    controller.createProduct
);

router.put(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    productValidation,
    validate,
    controller.updateProduct
);

router.delete(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deleteProduct
);

module.exports = router;