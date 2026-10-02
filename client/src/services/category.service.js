import API from "../api";

// =====================================================
// GET ALL ACTIVE CATEGORIES
// =====================================================

export const getCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Get Categories Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch categories.",
      }
    );
  }
};

// =====================================================
// GET CATEGORY BY ID
// =====================================================

export const getCategoryById = async (id) => {
  try {
    const response = await API.get(`/categories/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Get Category Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch category.",
      }
    );
  }
};

// =====================================================
// CREATE CATEGORY
// =====================================================

export const createCategory = async (formData) => {
  try {
    const response = await API.post("/categories", formData);

    return response.data;
  } catch (error) {
    console.error(
      "Create Category Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to create category.",
      }
    );
  }
};

// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategory = async (id, formData) => {
  try {
    const response = await API.put(
      `/categories/${id}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Category Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to update category.",
      }
    );
  }
};

// =====================================================
// DELETE CATEGORY
// =====================================================

export const deleteCategory = async (id) => {
  try {
    const response = await API.delete(`/categories/${id}`);

    return response.data;
  } catch (error) {
    console.error(
      "Delete Category Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to delete category.",
      }
    );
  }
};