import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import { getProducts } from "../../services/product.service";
import { getImageUrl } from "../../utils/imageUrl";

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      console.log("HOME PRODUCTS:", data);

      // getProducts() returns the actual product array
      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "HOME PRODUCTS ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          py: 10,
          bgcolor: "#F8F9FA",
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            align="center"
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            Featured Products
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress color="success" />
          </Box>
        </Container>
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        py: {
          xs: 6,
          sm: 8,
          md: 10,
        },
        bgcolor: "#F8F9FA",
      }}
    >
      <Container maxWidth="xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
            },
          }}
        >
          Featured Products
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 6,
          }}
        >
          Discover our premium Ayurvedic and
          herbal wellness products.
        </Typography>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Typography
            align="center"
            color="error"
            sx={{ mb: 4 }}
          >
            {error}
          </Typography>
        )}

        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {!error && products.length === 0 && (
          <Typography
            align="center"
            color="text.secondary"
          >
            No products available.
          </Typography>
        )}

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {products.length > 0 && (
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 3,
              md: 4,
            }}
          >
            {products
              .slice(0, 6)
              .map((product) => {

                const imageUrl =
                  product.images?.length > 0
                    ? getImageUrl(
                        product.images[0]
                      )
                    : "/images/no-image.png";

                return (
                  <Grid
                    key={product._id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 2,
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        minHeight: 480,
                        borderRadius: 4,
                        overflow: "hidden",

                        display: "flex",
                        flexDirection: "column",

                        boxShadow:
                          "0 5px 18px rgba(0,0,0,0.12)",

                        transition:
                          "transform .25s, box-shadow .25s",

                        "&:hover": {
                          transform:
                            "translateY(-6px)",

                          boxShadow:
                            "0 12px 30px rgba(0,0,0,0.18)",
                        },
                      }}
                    >

                      {/* =================================
                          PRODUCT IMAGE
                      ================================= */}

                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={
                          product.productName ||
                          "Product"
                        }
                        sx={{
                          height: {
                            xs: 220,
                            sm: 230,
                            md: 220,
                          },

                          width: "100%",

                          objectFit: "cover",

                          bgcolor: "#F5F5F5",
                        }}
                      />

                      {/* =================================
                          PRODUCT CONTENT
                      ================================= */}

                      <CardContent
                        sx={{
                          flexGrow: 1,

                          display: "flex",

                          flexDirection:
                            "column",

                          p: 2,
                        }}
                      >

                        {/* CATEGORY */}

                        <Box
                          sx={{
                            mb: 1.5,
                            minHeight: 30,
                          }}
                        >
                          {product.category && (
                            <Chip
                              label={
                                product.category
                              }
                              size="small"
                              color="success"
                              sx={{
                                fontWeight: 500,
                                maxWidth:
                                  "100%",
                              }}
                            />
                          )}
                        </Box>

                        {/* PRODUCT NAME */}

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1.05rem",
                            },

                            lineHeight: 1.45,

                            minHeight: 58,

                            overflow: "hidden",

                            display:
                              "-webkit-box",

                            WebkitLineClamp: 2,

                            WebkitBoxOrient:
                              "vertical",
                          }}
                        >
                          {
                            product.productName
                          }
                        </Typography>

                        {/* BRAND */}

                        {product.brand && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {product.brand}
                          </Typography>
                        )}

                        {/* DESCRIPTION */}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,

                            lineHeight: 1.5,

                            minHeight: 48,

                            overflow: "hidden",

                            display:
                              "-webkit-box",

                            WebkitLineClamp: 2,

                            WebkitBoxOrient:
                              "vertical",
                          }}
                        >
                          {product.description ||
                            "Premium quality product from Bhagyamma Hub."}
                        </Typography>

                        {/* PRICE */}

                        <Typography
                          variant="h6"
                          color="success.main"
                          fontWeight={700}
                          sx={{
                            mt: 2,
                            fontSize:
                              "1.35rem",
                          }}
                        >
                          ₹
                          {product.sellingPrice ??
                            product.price ??
                            0}
                        </Typography>

                        {/* PUSH BUTTON TO BOTTOM */}

                        <Box
                          sx={{
                            flexGrow: 1,
                          }}
                        />

                        {/* =================================
                            VIEW DETAILS ONLY
                        ================================= */}

                        <Button
                          component={Link}
                          to={`/products/${product._id}`}
                          variant="outlined"
                          color="success"
                          fullWidth
                          sx={{
                            mt: 2,
                            py: 1.1,
                            borderRadius: 2,

                            textTransform:
                              "none",

                            fontWeight: 600,

                            borderWidth: 1.5,

                            "&:hover": {
                              borderWidth: 1.5,
                            },
                          }}
                        >
                          View Details
                        </Button>

                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        )}

        {/* =================================================
            VIEW ALL PRODUCTS
        ================================================= */}

        <Stack
          alignItems="center"
          sx={{
            mt: 7,
          }}
        >
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="success"
            size="large"
            sx={{
              px: 5,
              py: 1.4,

              borderRadius: 3,

              textTransform:
                "none",

              fontWeight: 700,
            }}
          >
            View All Products
          </Button>
        </Stack>

      </Container>
    </Box>
  );
};

export default ProductPreview;