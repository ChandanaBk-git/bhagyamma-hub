import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Typography,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { Home } from "@mui/icons-material";

import ProductForm from "../../components/products/ProductForm";

import {
  getProductById,
  updateProduct,
} from "../../services/product.service";

const EditProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [product, setProduct] = useState(null);

useEffect(() => {
  if (id) {
    loadProduct();
  }
}, [id]);

const loadProduct = async () => {
  try {
    setLoading(true);

    const product = await getProductById(id);

    console.log("Product:", product);

    setProduct(product);

  } catch (err) {

    console.error(err);

    setError("Unable to load product.");

  } finally {

    setLoading(false);

  }
};

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);

      await updateProduct(id, formData);

      alert("✅ Product Updated Successfully");

      navigate("/admin/products");

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
          "Unable to update product."
      );

    } finally {

      setLoading(false);

    }
  };

  if (!product) {
    return (
      <Typography
        sx={{
          mt: 5,
          textAlign: "center",
        }}
      >
        Loading...
      </Typography>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Breadcrumbs
        sx={{
          mb: 2,
        }}
      >
        <Link
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/admin/dashboard")
          }
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
          sx={{
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/admin/products")
          }
        >
          Products
        </Link>

        <Typography>
          Edit Product
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Edit Product
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
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
        <ProductForm
          mode="edit"
          initialValues={product}
          loading={loading}
          onSubmit={handleUpdate}
          onCancel={() =>
            navigate("/admin/products")
          }
        />
      </Paper>
    </Container>
  );
};

export default EditProduct;