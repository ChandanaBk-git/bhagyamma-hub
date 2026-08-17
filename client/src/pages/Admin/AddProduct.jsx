import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
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

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createProduct(formData);

      alert("✅ Product added successfully");

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          <Home
            sx={{
              mr: 0.5,
              fontSize: 18,
            }}
          />
          Dashboard
        </Link>

        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/products")}
        >
          Products
        </Link>

        <Typography color="text.primary">
          Add Product
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Add New Product
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
          borderRadius: 4,
        }}
      >
        <Box>
<ProductForm
  mode="create"
  loading={loading}
  onSubmit={handleSubmit}
  onCancel={() => navigate("/admin/products")}
/>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;