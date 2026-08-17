const express = require("express");

const router =
  express.Router();


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

const upload =
  require(
    "../middleware/productUpload.middleware"
  );


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

  /*
   * Debug
   */

  (req, res, next) => {

    console.log(
      "======================================"
    );

    console.log(
      "✅ POST /products reached"
    );

    next();

  },

  /*
   * Authentication
   */

  protect,

  /*
   * Only Super Admin can create products
   */

  authorize(
    "SUPER_ADMIN"
  ),

  /*
   * PRODUCT IMAGE UPLOAD
   */

  upload.array(
    "images",
    5
  ),

  /*
   * Multer Debug
   */

  (req, res, next) => {

    console.log(
      "======================================"
    );

    console.log(
      "✅ Product Multer executed"
    );

    console.log(
      "FILES:"
    );

    console.log(
      req.files
    );

    next();

  },

  /*
   * Create Product
   */

  controller.createProduct
);


/* =====================================================
   UPDATE PRODUCT
===================================================== */

router.put(
  "/:id",

  /*
   * Authentication
   */

  protect,

  /*
   * Only Super Admin
   */

  authorize(
    "SUPER_ADMIN"
  ),

  /*
   * Product Images
   */

  upload.array(
    "images",
    5
  ),

  /*
   * Validation
   */

  productValidation,

  validate,

  /*
   * Update Product
   */

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