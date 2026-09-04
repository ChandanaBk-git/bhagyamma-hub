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
  Typography,
} from "@mui/material";

import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { getImageUrl } from "../../utils/imageUrl";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const image = getImageUrl(product?.images?.[0]);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product, 1);

      if (!result?.success) {
        setSnackbar({
          open: true,
          severity: "error",
          message:
            result?.error?.response?.data?.message ||
            result?.error?.message ||
            "Unable to add product to cart.",
        });

        return;
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: "Product added to cart successfully.",
      });
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message ||
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
          width: "100%",
          minWidth: 0,
          height: "100%",

          display: "flex",
          flexDirection: "column",

          borderRadius: 0,
          overflow: "hidden",

          bgcolor: "#fff",

          // CLEAR BORDER FOR EACH PRODUCT
          border: "1px solid #DDE4DE",

          transition: "border-color 0.2s ease, box-shadow 0.2s ease",

          "&:hover": {
            borderColor: "#1B5E20",
            boxShadow: "0 3px 10px rgba(27,94,32,0.08)",
          },
        }}
      >
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <Box
          sx={{
            position: "relative",
            width: "100%",

            height: {
              xs: 135,
              sm: 165,
              md: 185,
            },

            bgcolor: "#F7F8F7",
            overflow: "hidden",
            flexShrink: 0,

            borderBottom: "1px solid #E5E9E6",
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={product?.productName || "Product"}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",

              p: {
                xs: 0.7,
                sm: 1,
                md: 1.2,
              },

              display: "block",
            }}
          />

          {/* CATEGORY */}
          {product?.category && (
            <Chip
              label={product.category}
              size="small"
              sx={{
                position: "absolute",

                top: 6,
                left: 6,

                maxWidth: "calc(100% - 12px)",

                height: {
                  xs: 18,
                  sm: 21,
                },

                bgcolor: "#E8F5E9",
                color: "#1B5E20",

                borderRadius: 0,

                fontWeight: 700,

                fontSize: {
                  xs: "0.43rem",
                  sm: "0.52rem",
                },

                "& .MuiChip-label": {
                  px: {
                    xs: 0.6,
                    sm: 0.8,
                  },

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          )}
        </Box>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <CardContent
          sx={{
            flex: 1,
            minWidth: 0,

            display: "flex",
            flexDirection: "column",

            p: {
              xs: 0.9,
              sm: 1.2,
              md: 1.4,
            },

            "&:last-child": {
              pb: {
                xs: 0.9,
                sm: 1.2,
                md: 1.4,
              },
            },
          }}
        >
          {/* PRODUCT NAME */}

          <Typography
            component="h2"
            sx={{
              minWidth: 0,

              fontWeight: 700,
              color: "#222",

              fontSize: {
                xs: "0.66rem",
                sm: "0.75rem",
                md: "0.82rem",
              },

              lineHeight: 1.35,

              minHeight: {
                xs: 27,
                sm: 30,
              },

              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",

              wordBreak: "break-word",
            }}
          >
            {product?.productName || "Product"}
          </Typography>

          {/* DESCRIPTION */}

          <Typography
            sx={{
              mt: 0.3,

              color: "#777",

              fontSize: {
                xs: "0.5rem",
                sm: "0.56rem",
                md: "0.62rem",
              },

              lineHeight: 1.4,

              minHeight: {
                xs: 23,
                sm: 26,
              },

              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",

              wordBreak: "break-word",
            }}
          >
            {product?.description ||
              "Premium quality product from Bhagyamma Hub."}
          </Typography>

          {/* BRAND */}

          {product?.brand && (
            <Typography
              sx={{
                mt: 0.4,

                color: "#888",

                fontSize: {
                  xs: "0.47rem",
                  sm: "0.52rem",
                  md: "0.57rem",
                },

                lineHeight: 1.2,

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.brand}
            </Typography>
          )}

          {/* PRICE */}

          <Box
            sx={{
              mt: "auto",
              pt: 0.6,
            }}
          >
            <Typography
              sx={{
                color: "#1B5E20",
                fontWeight: 800,

                fontSize: {
                  xs: "0.8rem",
                  sm: "0.9rem",
                  md: "0.98rem",
                },

                lineHeight: 1.2,
              }}
            >
              ₹{product?.price ?? 0}
            </Typography>
          </Box>
        </CardContent>

        {/* =====================================================
            SMALL ACTION BUTTONS
        ===================================================== */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,

            px: {
              xs: 0.9,
              sm: 1.2,
              md: 1.4,
            },

            pb: {
              xs: 0.9,
              sm: 1.2,
              md: 1.4,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",

              gap: {
                xs: 0.4,
                sm: 0.5,
              },
            }}
          >
            {/* VIEW PRODUCT */}

            <Button
              component={Link}
              to={`/products/${product?._id}`}
              variant="contained"
              disableElevation
              startIcon={
                <VisibilityRoundedIcon
                  sx={{
                    fontSize: {
                      xs: 10,
                      sm: 12,
                      md: 13,
                    },
                  }}
                />
              }
              sx={{
                minWidth: 0,
                width: "100%",

                height: {
                  xs: 26,
                  sm: 28,
                  md: 30,
                },

                px: {
                  xs: 0.3,
                  sm: 0.5,
                  md: 0.7,
                },

                borderRadius: 0,

                bgcolor: "#1B5E20",
                color: "#fff",

                textTransform: "none",

                fontWeight: 600,

                fontSize: {
                  xs: "0.39rem",
                  sm: "0.48rem",
                  md: "0.54rem",
                },

                lineHeight: 1,

                whiteSpace: "nowrap",

                overflow: "hidden",

                "& .MuiButton-startIcon": {
                  margin: 0,
                  marginRight: {
                    xs: 0.15,
                    sm: 0.25,
                  },

                  flexShrink: 0,
                },

                "&:hover": {
                  bgcolor: "#154A19",
                },
              }}
            >
              View
            </Button>

            {/* ADD TO CART */}

            <Button
              variant="outlined"
              onClick={handleAddToCart}
              startIcon={
                <ShoppingCartRoundedIcon
                  sx={{
                    fontSize: {
                      xs: 10,
                      sm: 12,
                      md: 13,
                    },
                  }}
                />
              }
              sx={{
                minWidth: 0,
                width: "100%",

                height: {
                  xs: 26,
                  sm: 28,
                  md: 30,
                },

                px: {
                  xs: 0.3,
                  sm: 0.5,
                  md: 0.7,
                },

                borderRadius: 0,

                borderColor: "#1B5E20",
                color: "#1B5E20",

                textTransform: "none",

                fontWeight: 600,

                fontSize: {
                  xs: "0.39rem",
                  sm: "0.48rem",
                  md: "0.54rem",
                },

                lineHeight: 1,

                whiteSpace: "nowrap",

                overflow: "hidden",

                "& .MuiButton-startIcon": {
                  margin: 0,
                  marginRight: {
                    xs: 0.15,
                    sm: 0.25,
                  },

                  flexShrink: 0,
                },

                "&:hover": {
                  borderColor: "#154A19",
                  bgcolor: "#F1F8F2",
                },
              }}
            >
              Cart
            </Button>
          </Box>
        </Box>
      </Card>

      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{
            width: "100%",

            borderRadius: 0,

            fontSize: {
              xs: "0.62rem",
              sm: "0.72rem",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;