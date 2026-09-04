import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product, 1);

      if (result?.success) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Product added to cart successfully.",
        });

        return;
      }

      setSnackbar({
        open: true,
        severity: "error",
        message:
          result?.error?.response?.data?.message ||
          result?.error?.message ||
          "Unable to add product.",
      });
    } catch (error) {
      console.error("Add To Cart Error:", error);

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
      <Stack
        spacing={{
          xs: 1.2,
          sm: 1.5,
        }}
      >
        {/* =================================================
            PRODUCT NAME
        ================================================= */}

        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#222",
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
              md: "1.8rem",
            },
            lineHeight: 1.25,
          }}
        >
          {product.productName}
        </Typography>

        {/* =================================================
            CATEGORY + STATUS
        ================================================= */}

        <Stack
          direction="row"
          spacing={0.7}
          flexWrap="wrap"
          useFlexGap
        >
          {product.category && (
            <Chip
              label={product.category}
              size="small"
              sx={{
                height: {
                  xs: 22,
                  sm: 25,
                },
                bgcolor: "#E8F5E9",
                color: "#1B5E20",
                borderRadius: 0,
                fontWeight: 700,
                fontSize: {
                  xs: "0.52rem",
                  sm: "0.6rem",
                },
              }}
            />
          )}

          {product.status && (
            <Chip
              label={product.status}
              size="small"
              sx={{
                height: {
                  xs: 22,
                  sm: 25,
                },
                bgcolor:
                  product.status === "Active"
                    ? "#E8F5E9"
                    : "#F5F5F5",
                color:
                  product.status === "Active"
                    ? "#2E7D32"
                    : "#777",
                borderRadius: 0,
                fontWeight: 600,
                fontSize: {
                  xs: "0.52rem",
                  sm: "0.6rem",
                },
              }}
            />
          )}
        </Stack>

        {/* =================================================
            BRAND
        ================================================= */}

        {product.brand && (
          <Typography
            sx={{
              color: "#777",
              fontSize: {
                xs: "0.62rem",
                sm: "0.7rem",
              },
            }}
          >
            Brand:{" "}
            <Box
              component="span"
              sx={{
                color: "#333",
                fontWeight: 600,
              }}
            >
              {product.brand}
            </Box>
          </Typography>
        )}

        {/* =================================================
            PRICE
        ================================================= */}

        <Typography
          sx={{
            color: "#1B5E20",
            fontWeight: 800,
            fontSize: {
              xs: "1.35rem",
              sm: "1.55rem",
              md: "1.8rem",
            },
            lineHeight: 1.2,
          }}
        >
          ₹{product.price}
        </Typography>

        <Divider />

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <Typography
          sx={{
            color: "#666",
            fontSize: {
              xs: "0.65rem",
              sm: "0.72rem",
              md: "0.8rem",
            },
            lineHeight: 1.55,
          }}
        >
          {product.description}
        </Typography>

        <Divider />

        {/* =================================================
            SPECIFICATIONS
        ================================================= */}

        <Typography
          sx={{
            fontWeight: 700,
            color: "#222",
            fontSize: {
              xs: "0.82rem",
              sm: "0.95rem",
            },
          }}
        >
          Product Specifications
        </Typography>

        <Box
          sx={{
            border: "1px solid #E1E6E2",
            bgcolor: "#fff",
          }}
        >
          <Specification
            title="Category"
            value={product.category}
          />

          <Specification
            title="Brand"
            value={product.brand}
          />

          <Specification
            title="Weight"
            value={product.weight || "-"}
          />

          <Specification
            title="Quantity"
            value={product.quantity || "-"}
          />

          <Specification
            title="Shelf Life"
            value={product.shelfLife || "-"}
          />

          <Specification
            title="Manufacturer"
            value={product.manufacturer || "-"}
          />

          <Specification
            title="Country Of Origin"
            value={product.countryOfOrigin || "-"}
          />

          <Specification
            title="SKU"
            value={product.sku || "-"}
            last
          />
        </Box>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <Stack
          direction="row"
          spacing={1}
          sx={{
            pt: 0.5,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddToCart}
            sx={{
              height: {
                xs: 36,
                sm: 40,
              },
              bgcolor: "#1B5E20",
              color: "#fff",
              borderRadius: 0,
              textTransform: "none",
              fontWeight: 700,
              fontSize: {
                xs: "0.58rem",
                sm: "0.68rem",
              },
              boxShadow: "none",

              "&:hover": {
                bgcolor: "#154A19",
                boxShadow: "none",
              },
            }}
          >
            Add To Cart
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/cart")}
            sx={{
              height: {
                xs: 36,
                sm: 40,
              },
              borderColor: "#B08D3C",
              color: "#8A6B25",
              borderRadius: 0,
              textTransform: "none",
              fontWeight: 700,
              fontSize: {
                xs: "0.58rem",
                sm: "0.68rem",
              },

              "&:hover": {
                borderColor: "#8A6B25",
                bgcolor: "#FBF8EF",
              },
            }}
          >
            Buy Now
          </Button>
        </Stack>
      </Stack>

      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            width: "100%",
            fontSize: {
              xs: "0.65rem",
              sm: "0.75rem",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// =====================================================
// SPECIFICATION ROW
// =====================================================

const Specification = ({
  title,
  value,
  last = false,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "40% 60%",
            sm: "35% 65%",
          },
          alignItems: "center",
          minHeight: {
            xs: 31,
            sm: 35,
          },
          px: {
            xs: 1,
            sm: 1.5,
          },
          py: 0.4,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: "#555",
            fontSize: {
              xs: "0.57rem",
              sm: "0.65rem",
            },
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#333",
            fontSize: {
              xs: "0.57rem",
              sm: "0.65rem",
            },
            textAlign: "right",
            wordBreak: "break-word",
          }}
        >
          {value || "-"}
        </Typography>
      </Box>

      {!last && (
        <Divider
          sx={{
            borderColor: "#EDF0ED",
          }}
        />
      )}
    </Box>
  );
};

export default ProductInfo;