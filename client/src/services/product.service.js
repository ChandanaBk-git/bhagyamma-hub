import axios from "../api/axios";

// Create Product
export const createProduct = async (formData) => {
  const response = await axios.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get All Products
export const getProducts = async () => {
  const response = await axios.get("/products");
  return response.data;
};

// Get Product By ID
export const getProductById = async (id) => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

// Update Product
export const updateProduct = async (id, formData) => {
  const response = await axios.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await axios.delete(`/products/${id}`);
  return response.data;
};