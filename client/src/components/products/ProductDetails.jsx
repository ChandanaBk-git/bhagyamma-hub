import { useEffect, useState } from "react";

import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";

import {
  Link as RouterLink,
  useParams,
} from "react-router-dom";

import ProductTabs from "../../components/products/ProductTabs";
import ProductGallery from "../../components/products/ProductGallery";
import ProductInfo from "../../components/products/ProductInfo";

import {
  getProductById,
  getProductBySlug,
} from "../../services/product.service";

const ProductDetails = () => {
  const { id: slugOrId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCT
  // =====================================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const isMongoId = /^[a-f\d]{24}$/i.test(slugOrId);

        const data = isMongoId
          ? await getProductById(slugOrId)
          : await getProductBySlug(slugOrId);

        setProduct(data);
      } catch (err) {
        console.error("PRODUCT DETAILS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slugOrId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 1,
          bgcolor: "#F8FAF8",
        }}
      >
        <CircularProgress color="success" size={26} />
        <Typography color="text.secondary" sx={{ fontSize: "0.75rem" }}>
          Loading product...
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "40vh",
          bgcolor: "#F8FAF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography
          align="center"
          color="error"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "40vh",
          bgcolor: "#F8FAF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
        >
          Product Not Found
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#F8FAF8",
        pb: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          pt: { xs: 1.5, sm: 2 },
        }}
      >
        {/* BREADCRUMBS */}
        <Breadcrumbs
          sx={{
            mb: 1.25,
            "& .MuiBreadcrumbs-separator": {
              fontSize: "0.7rem",
              color: "#999",
              mx: 0.6,
            },
          }}
        >
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/"
            sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" } }}
          >
            Home
          </Link>

          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/products"
            sx={{ fontSize: { xs: "0.68rem", sm: "0.74rem" } }}
          >
            Products
          </Link>

          <Typography
            color="text.primary"
            sx={{
              maxWidth: { xs: 160, sm: 320 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: { xs: "0.68rem", sm: "0.74rem" },
              fontWeight: 600,
            }}
          >
            {product.productName}
          </Typography>
        </Breadcrumbs>

        {/* COMPACT PRODUCT CARD */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E1E6E2",
            p: { xs: 1.5, sm: 2, md: 2.5 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 2.5, md: 3 }}
            alignItems="flex-start"
          >
            {/* PRODUCT GALLERY */}
            <Grid size={{ xs: 12, md: 5 }}>
              <ProductGallery images={product.images} />
            </Grid>

            {/* PRODUCT INFORMATION */}
            <Grid size={{ xs: 12, md: 7 }}>
              <ProductInfo product={product} />
            </Grid>
          </Grid>
        </Box>

        {/* PRODUCT TABS */}
        <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
          <ProductTabs product={product} />
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;