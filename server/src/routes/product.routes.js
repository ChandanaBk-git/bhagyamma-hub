const express = require("express");

const router =
  express.Router();
const {
  productImageUpload,
} = require("../middleware/imageUpload.middleware");

/* =====================================================
   CONTROLLERS
===================================================== */

const controller =
  require("../controllers/product.controller");


/* =====================================================
   AUTH
===================================================== */

const {
  protect,
} = require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");


/* =====================================================
   PRODUCT IMAGE UPLOAD
===================================================== */

// const upload =
//   require(
//     "../middleware/productUpload.middleware"
//   );


/* =====================================================
   VALIDATION
===================================================== */

const validate =
  require(
    "../middleware/validate.middleware"
  );

const {
  productValidation,
} = require(
  "../validations/product.validation"
);


/* =====================================================
   GET ALL PRODUCTS
===================================================== */

router.get(
  "/",
  controller.getAllProducts
);


/* =====================================================
   GET PRODUCT BY ID
===================================================== */

router.get(
  "/:id",
  controller.getProductById
);


/* =====================================================
   CREATE PRODUCT
===================================================== */

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  productImageUpload.array("images", 5),
  productValidation,
  validate,
  controller.createProduct
);


/* =====================================================
   UPDATE PRODUCT
===================================================== */

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  productImageUpload.array("images", 5),
  productValidation,
  validate,
  controller.updateProduct
);

/* =====================================================
   DELETE PRODUCT
===================================================== */

router.delete(
  "/:id",

  protect,

  authorize(
    "SUPER_ADMIN"
  ),

  controller.deleteProduct
);


/* =====================================================
   EXPORT
===================================================== */

module.exports =
  router;