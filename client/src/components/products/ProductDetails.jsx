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

import { getProductById } from "../../services/product.service";

const ProductDetails = () => {
  const { id } = useParams();

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

        const data = await getProductById(id);

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
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 1,
          bgcolor: "#F8FAF8",
        }}
      >
        <CircularProgress
          color="success"
          size={30}
        />

        <Typography
          color="text.secondary"
          sx={{
            fontSize: "0.7rem",
          }}
        >
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
          minHeight: "50vh",
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
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.8rem",
            },
          }}
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
          minHeight: "50vh",
          bgcolor: "#F8FAF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          color="text.secondary"
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.8rem",
            },
          }}
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
        minHeight: "100vh",
        bgcolor: "#F8FAF8",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          py: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* =================================================
            BREADCRUMBS
        ================================================= */}

        <Breadcrumbs
          sx={{
            mb: {
              xs: 1.5,
              sm: 2,
            },

            "& .MuiBreadcrumbs-separator": {
              fontSize: "0.65rem",
              color: "#999",
            },
          }}
        >
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/"
            sx={{
              fontSize: {
                xs: "0.55rem",
                sm: "0.65rem",
              },
            }}
          >
            Home
          </Link>

          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/products"
            sx={{
              fontSize: {
                xs: "0.55rem",
                sm: "0.65rem",
              },
            }}
          >
            Products
          </Link>

          <Typography
            color="text.primary"
            sx={{
              maxWidth: {
                xs: 150,
                sm: 300,
              },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: {
                xs: "0.55rem",
                sm: "0.65rem",
              },
              fontWeight: 600,
            }}
          >
            {product.productName}
          </Typography>
        </Breadcrumbs>

        {/* =================================================
            PRODUCT SECTION
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 2,
            sm: 3,
            md: 4,
          }}
          alignItems="flex-start"
        >
          {/* PRODUCT GALLERY */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ProductGallery
              images={product.images}
            />
          </Grid>

          {/* PRODUCT INFORMATION */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ProductInfo
              product={product}
            />
          </Grid>
        </Grid>

        {/* =================================================
            PRODUCT TABS
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          <ProductTabs
            product={product}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;