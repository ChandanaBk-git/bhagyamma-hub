import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";

import { getImageUrl } from "../../utils/imageUrl";
import { getProductById } from "../../services/product.service";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await getProductById(id);

      // Your API returns product in response.message
      setProduct(response.message);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          py: 10,
          textAlign: "center",
        }}
      >
        <Typography variant="h5">
          Product Not Found
        </Typography>

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          color="success"
          onClick={() => navigate("/products")}
        >
          Back To Products
        </Button>
      </Box>
    );
  }

const imageUrl =
  product.images && product.images.length > 0
    ? getImageUrl(product.images[selectedImage])
    : "https://via.placeholder.com/600";
  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        py: 5,
        px: 2,
      }}
    >
      <Grid container spacing={5}>
              {/* Left Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            {/* Main Product Image */}
            <Box
              sx={{
                width: "100%",
                height: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fafafa",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <img
                src={imageUrl}
                alt={product.productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "0.3s",
                }}
              />
            </Box>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <Stack
                direction="row"
                spacing={2}
                mt={3}
                justifyContent="center"
                flexWrap="wrap"
              >
                {product.images.map((image, index) => (
                  <Paper
                    key={index}
                    elevation={selectedImage === index ? 6 : 1}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      p: 1,
                      cursor: "pointer",
                      border:
                        selectedImage === index
                          ? "2px solid #2e7d32"
                          : "1px solid #ddd",
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Back Button */}
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 4 }}
              onClick={() => navigate("/products")}
            >
              Back To Products
            </Button>
          </Paper>
        </Grid>
        {/* Right Section */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              {product.productName}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Chip
                label={product.category}
                color="success"
              />

              <Chip
                label={product.brand}
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Price */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                }}
              >
                ₹{product.mrp}
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                fontWeight="bold"
              >
                ₹{product.sellingPrice}
              </Typography>

              {product.mrp > product.sellingPrice && (
                <Chip
                  color="error"
                  label={`${Math.round(
                    ((product.mrp - product.sellingPrice) /
                      product.mrp) *
                      100
                  )}% OFF`}
                />
              )}
            </Box>

            {/* Stock */}
            <Typography
              sx={{ mb: 3 }}
              fontWeight="bold"
              color={
                product.stock > 0
                  ? "success.main"
                  : "error.main"
              }
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
            >
              Description
            </Typography>

            <Typography
              color="text.secondary"
              paragraph
            >
              {product.description}
            </Typography>

            {/* Benefits */}
            {product.benefits && (
              <>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                >
                  Benefits
                </Typography>

                <Typography
                  color="text.secondary"
                  paragraph
                >
                  {product.benefits}
                </Typography>
              </>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                >
                  Ingredients
                </Typography>

                <Typography
                  color="text.secondary"
                  paragraph
                >
                  {product.ingredients}
                </Typography>
              </>
            )}

            {/* Product Information */}
            <Paper
              elevation={1}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#fafafa",
              }}
            >
              <Typography variant="subtitle1">
                <strong>Brand:</strong> {product.brand}
              </Typography>

              <Typography variant="subtitle1">
                <strong>Category:</strong> {product.category}
              </Typography>

              <Typography variant="subtitle1">
                <strong>Stock:</strong> {product.stock}
              </Typography>
            </Paper>

            {/* Buttons */}
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              mt={4}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
              >
                Add To Cart
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
              >
                Buy Now
              </Button>
            </Stack>
          </Box>
        </Grid>


      </Grid>

          </Box>
  );
};

export default ProductDetails;