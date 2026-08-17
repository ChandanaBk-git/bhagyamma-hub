import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";

import ProductTabs from "../../components/products/ProductTabs";
import ProductGallery from "../../components/products/ProductGallery";
import { getProductById } from "../../services/product.service";
import ProductInfo from "../../components/products/ProductInfo";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(id);

      setProduct(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography
          align="center"
          color="error"
        >
          {error}
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography align="center">
          Product Not Found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>

      <Breadcrumbs sx={{ mb: 4 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
        >
          Home
        </Link>

        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/products"
        >
          Products
        </Link>

        <Typography color="text.primary">
          {product.productName}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={5}>

        {/* LEFT SIDE */}

        <Grid item xs={12} md={6}>
          <ProductGallery
            images={product.images}
          />
        </Grid>

        {/* RIGHT SIDE */}

        <Grid item xs={12} md={6}>
  <ProductInfo product={product} />
</Grid>
      </Grid>

      <ProductTabs product={product} />
    </Container>
  );
};

export default ProductDetails;