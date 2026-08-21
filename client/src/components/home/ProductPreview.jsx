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

const FALLBACK_IMAGE = "/images/no-image.png";

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        console.log("=================================");
        console.log("HOME PRODUCTS RESPONSE:", data);
        console.log("=================================");

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("HOME PRODUCTS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load products."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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

        {/* HEADER */}

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
          Discover our premium Ayurvedic and herbal wellness products.
        </Typography>

        {/* ERROR */}

        {error && (
          <Typography
            align="center"
            color="error"
            sx={{ mb: 4 }}
          >
            {error}
          </Typography>
        )}

        {/* EMPTY */}

        {!error && products.length === 0 && (
          <Typography
            align="center"
            color="text.secondary"
          >
            No products available.
          </Typography>
        )}

        {/* PRODUCTS */}

        {products.length > 0 && (
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 3,
              md: 4,
            }}
          >
            {products.slice(0, 6).map((product) => {

              const rawImage =
                product?.images?.[0] || "";

              const imageUrl =
                getImageUrl(rawImage);

              console.log(
                "================================="
              );

              console.log(
                "PRODUCT:",
                product?.productName
              );

              console.log(
                "RAW IMAGE:",
                rawImage
              );

              console.log(
                "FINAL IMAGE URL:",
                imageUrl
              );

              return (
                <Grid
                  key={product?._id}
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
                    }}
                  >

                    {/* IMAGE */}

                    <Box
                      sx={{
                        width: "100%",
                        height: {
                          xs: 220,
                          sm: 230,
                          md: 220,
                        },
                        bgcolor: "#F5F5F5",
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={imageUrl}
                        alt={
                          product?.productName ||
                          "Product"
                        }
                        onLoad={() => {
                          console.log(
                            "IMAGE LOADED:",
                            imageUrl
                          );
                        }}
                        onError={(event) => {
                          console.error(
                            "IMAGE FAILED:",
                            imageUrl
                          );

                          // Prevent infinite fallback loop
                          if (
                            event.currentTarget.src.endsWith(
                              FALLBACK_IMAGE
                            )
                          ) {
                            return;
                          }

                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>

                    {/* CONTENT */}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
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
                        {product?.category && (
                          <Chip
                            label={product.category}
                            size="small"
                            color="success"
                            sx={{
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>

                      {/* NAME */}

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          lineHeight: 1.45,
                          minHeight: 58,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product?.productName}
                      </Typography>

                      {/* BRAND */}

                      {product?.brand && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product?.description ||
                          "Premium quality product from Bhagyamma Hub."}
                      </Typography>

                      {/* PRICE */}

                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight={700}
                        sx={{
                          mt: 2,
                          fontSize: "1.35rem",
                        }}
                      >
                        ₹
                        {product?.sellingPrice ??
                          product?.price ??
                          0}
                      </Typography>

                      <Box sx={{ flexGrow: 1 }} />

                      {/* DETAILS */}

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
                          textTransform: "none",
                          fontWeight: 600,
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

        {/* VIEW ALL */}

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
              textTransform: "none",
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