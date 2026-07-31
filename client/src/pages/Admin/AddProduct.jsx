import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

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
    <Container maxWidth="lg">

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Add Product
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <ProductForm
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Paper>

    </Container>
  );
};

export default AddProduct;