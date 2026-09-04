import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
  Box,
} from "@mui/material";

import { Home } from "@mui/icons-material";

import ProductForm from "../../components/products/ProductForm";
import { createProduct } from "../../services/product.service";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // SUBMIT PRODUCT
  // =========================================

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createProduct(formData);

      alert("✅ Product added successfully");

      navigate("/admin/products");
    } catch (err) {
      console.error("Create product error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        boxSizing: "border-box",

        margin: 0,

        overflowX: "hidden",

        padding: {
          xs: "10px 8px 20px",
          sm: "16px 14px 24px",
          md: "24px 0 32px",
        },
      }}
    >
      {/* =========================================
          BREADCRUMBS
      ========================================= */}

      <Breadcrumbs
        sx={{
          mb: {
            xs: 1,
            sm: 1.5,
            md: 2,
          },

          fontSize: {
            xs: "11px",
            sm: "12px",
            md: "14px",
          },

          whiteSpace: "nowrap",

          overflow: "hidden",

          "& .MuiBreadcrumbs-ol": {
            flexWrap: "nowrap",
          },

          "& .MuiBreadcrumbs-li": {
            minWidth: 0,
          },
        }}
      >
        {/* DASHBOARD */}

        <Link
          underline="hover"
          color="inherit"
          sx={{
            display: "flex",
            alignItems: "center",

            cursor: "pointer",

            fontSize: {
              xs: "11px",
              sm: "12px",
              md: "14px",
            },
          }}
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          <Home
            sx={{
              mr: 0.4,

              fontSize: {
                xs: 15,
                sm: 17,
                md: 18,
              },
            }}
          />

          Dashboard
        </Link>

        {/* PRODUCTS */}

        <Link
          underline="hover"
          color="inherit"
          sx={{
            cursor: "pointer",

            fontSize: {
              xs: "11px",
              sm: "12px",
              md: "14px",
            },
          }}
          onClick={() =>
            navigate("/admin/products")
          }
        >
          Products
        </Link>

        {/* CURRENT PAGE */}

        <Typography
          color="text.primary"
          sx={{
            fontSize: {
              xs: "11px",
              sm: "12px",
              md: "14px",
            },

            whiteSpace: "nowrap",
          }}
        >
          Add Product
        </Typography>
      </Breadcrumbs>

      {/* =========================================
          PAGE TITLE
      ========================================= */}

      <Typography
        component="h1"
        sx={{
          margin: 0,

          mb: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          fontSize: {
            xs: "21px",
            sm: "24px",
            md: "30px",
          },

          lineHeight: {
            xs: "26px",
            sm: "30px",
            md: "36px",
          },

          fontWeight: 700,

          color: "#292929",
        }}
      >
        Add New Product
      </Typography>

      {/* =========================================
          ERROR MESSAGE
      ========================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },

            borderRadius: {
              xs: "8px",
              sm: "9px",
              md: "10px",
            },

            fontSize: {
              xs: "12px",
              sm: "13px",
              md: "14px",
            },

            "& .MuiAlert-message": {
              padding: "2px 0",
            },
          }}
        >
          {error}
        </Alert>
      )}

      {/* =========================================
          PRODUCT FORM CONTAINER
      ========================================= */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          boxSizing: "border-box",

          margin: 0,

          /*
           * Compact mobile spacing.
           */
          padding: {
            xs: "12px",
            sm: "18px",
            md: "28px",
          },

          borderRadius: {
            xs: "9px",
            sm: "11px",
            md: "14px",
          },

          border: "1px solid #D8D8D8",

          backgroundColor: "#FFFFFF",

          boxShadow: {
            xs: "none",
            sm: "0 1px 5px rgba(0,0,0,0.08)",
            md: "0 2px 8px rgba(0,0,0,0.10)",
          },

          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,

            margin: 0,
            padding: 0,

            boxSizing: "border-box",

            overflowX: "hidden",

            // Make common form elements fit mobile.
            "& .MuiTextField-root": {
              maxWidth: "100%",
            },

            "& .MuiFormControl-root": {
              maxWidth: "100%",
            },

            "& input": {
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& textarea": {
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiButton-root": {
              maxWidth: "100%",
            },
          }}
        >
          <ProductForm
            mode="create"
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={() =>
              navigate("/admin/products")
            }
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProduct;