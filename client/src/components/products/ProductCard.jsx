import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { useCart } from "../../context/CartContext";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || ""
).replace("/api/v1", "");

const ProductCard = ({
  product,
}) => {
  const { addToCart } =
    useCart();

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });

  const image =
    product?.images?.length > 0
      ? `${BACKEND_URL}${product.images[0]}`
      : "/images/no-image.png";

  const handleAddToCart =
    async () => {
      try {
        /*
        IMPORTANT:
        No login check here.

        Guests are allowed to add
        products to localStorage.
        */

        const result =
          await addToCart(
            product,
            1
          );

        if (!result?.success) {
          setSnackbar({
            open: true,
            severity: "error",
            message:
              result?.error
                ?.response?.data
                ?.message ||
              result?.error
                ?.message ||
              "Unable to add product to cart.",
          });

          return;
        }

        setSnackbar({
          open: true,
          severity: "success",
          message:
            "Product added to cart successfully.",
        });
      } catch (error) {
        console.error(
          "ADD TO CART ERROR:",
          error
        );

        setSnackbar({
          open: true,
          severity: "error",
          message:
            error?.response
              ?.data?.message ||
            error?.message ||
            "Unable to add product to cart.",
        });
      }
    };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#fff",
          border:
            "1px solid #E3EAE4",
          transition:
            "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",

          "&:hover": {
            transform:
              "translateY(-6px)",
            boxShadow:
              "0 14px 32px rgba(46, 125, 50, 0.14)",
            borderColor:
              "#A5D6A7",
          },
        }}
      >
        <Box
          sx={{
            position:
              "relative",
            width: "100%",
            height: {
              xs: 220,
              sm: 230,
              md: 240,
            },
            backgroundColor:
              "#F7F8F7",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={
              product?.productName ||
              "Product"
            }
            sx={{
              width: "100%",
              height: "100%",
              objectFit:
                "contain",
              p: 2,
            }}
          />

          {product?.category && (
            <Chip
              label={
                product.category
              }
              size="small"
              sx={{
                position:
                  "absolute",
                top: 12,
                left: 12,
                backgroundColor:
                  "#E8F5E9",
                color:
                  "#2E7D32",
                fontWeight: 700,
                fontSize:
                  "0.72rem",
                borderRadius: 2,
              }}
            />
          )}
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection:
              "column",
            p: {
              xs: 2,
              sm: 2.3,
            },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              color: "#222",
              fontSize: {
                xs: "1rem",
                sm: "1.05rem",
              },
              lineHeight: 1.4,
              minHeight: 45,
              display:
                "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient:
                "vertical",
              overflow: "hidden",
            }}
          >
            {product?.productName ||
              "Product"}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#777",
              fontSize: {
                xs: "0.8rem",
                sm: "0.84rem",
              },
              lineHeight: 1.55,
              minHeight: 40,
              display:
                "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient:
                "vertical",
              overflow: "hidden",
            }}
          >
            {product?.description ||
              "Premium quality product from Bhagyamma Hub."}
          </Typography>

          {product?.brand && (
            <Typography
              sx={{
                mt: 1.2,
                color: "#777",
                fontSize:
                  "0.78rem",
              }}
            >
              {product.brand}
            </Typography>
          )}

          <Box
            sx={{
              mt: "auto",
              pt: 2,
            }}
          >
            <Typography
              sx={{
                color:
                  "#2E7D32",
                fontWeight: 800,
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.35rem",
                },
              }}
            >
              ₹
              {product?.price ??
                0}
            </Typography>
          </Box>
        </CardContent>

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.3,
            },
            pb: {
              xs: 2,
              sm: 2.3,
            },
          }}
        >
          <Stack spacing={1.2}>
            <Button
              component={Link}
              to={`/products/${product._id}`}
              variant="contained"
              fullWidth
              startIcon={
                <VisibilityRoundedIcon />
              }
              sx={{
                minHeight: 44,
                borderRadius: 2,
                backgroundColor:
                  "#2E7D32",
                textTransform:
                  "none",
                fontWeight: 700,

                "&:hover": {
                  backgroundColor:
                    "#1B5E20",
                },
              }}
            >
              View Product
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={
                <ShoppingCartRoundedIcon />
              }
              onClick={
                handleAddToCart
              }
              sx={{
                minHeight: 44,
                borderRadius: 2,
                borderColor:
                  "#2E7D32",
                color:
                  "#2E7D32",
                textTransform:
                  "none",
                fontWeight: 700,

                "&:hover": {
                  borderColor:
                    "#1B5E20",
                  backgroundColor:
                    "#E8F5E9",
                },
              }}
            >
              Add to Cart
            </Button>
          </Stack>
        </Box>
      </Card>

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          5000
        }
        onClose={() =>
          setSnackbar(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={
            snackbar.severity
          }
          variant="filled"
          onClose={() =>
            setSnackbar(
              (previous) => ({
                ...previous,
                open: false,
              })
            )
          }
          sx={{
            width: "100%",
          }}
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;