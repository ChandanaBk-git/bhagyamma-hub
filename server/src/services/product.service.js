const productRepository =
  require("../repositories/product.repository");


/* =========================================================
   REMOVE INVENTORY STOCK
========================================================= */

/*
  Stock is no longer used anywhere in the product system.

  This helper protects the backend from old frontend/admin
  forms that may still send:

  {
    stock: 20
  }

  The value will simply be ignored.
*/

const removeStockField = (
  productData = {}
) => {

  const cleanData = {
    ...productData,
  };

  delete cleanData.stock;

  return cleanData;

};


/* =========================================================
   CREATE PRODUCT
========================================================= */

const createProduct = async (
  productData
) => {

  const cleanData =
    removeStockField(
      productData
    );

  return await productRepository.create(
    cleanData
  );

};


/* =========================================================
   GET ALL PRODUCTS
========================================================= */

const getAllProducts = async (
  options = {}
) => {

  const filter = {};


  if (
    options.activeOnly
  ) {

    filter.status =
      "Active";

  }


  if (
    options.status
  ) {

    filter.status =
      options.status;

  }


  return await productRepository.findAll(
    filter
  );

};


/* =========================================================
   GET PRODUCT BY ID
========================================================= */

const getProductById = async (
  id
) => {

  return await productRepository.findById(
    id
  );

};


/* =========================================================
   UPDATE PRODUCT
========================================================= */

const updateProduct = async (
  id,
  data
) => {

  const cleanData =
    removeStockField(
      data
    );

  return await productRepository.updateById(
    id,
    cleanData
  );

};


/* =========================================================
   DELETE PRODUCT
========================================================= */

const deleteProduct = async (
  id
) => {

  return await productRepository.deleteById(
    id
  );

};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  createProduct,

  getAllProducts,

  getProductById,

  updateProduct,

  deleteProduct,

};