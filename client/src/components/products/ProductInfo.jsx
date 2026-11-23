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

  const [buyNowLoading, setBuyNowLoading] = useState(false);

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

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = async () => {
    if (buyNowLoading) return;

    try {
      setBuyNowLoading(true);

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

      navigate("/cart");
    } catch (error) {
      console.error("Buy Now Error:", error);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to add product to cart.",
      });
    } finally {
      setBuyNowLoading(false);
    }
  };

  const specs = [
    { title: "Category", value: product.category },
    { title: "Brand", value: product.brand },
    { title: "Weight", value: product.weight },
    { title: "Quantity", value: product.quantity },
    { title: "Shelf Life", value: product.shelfLife },
    { title: "Manufacturer", value: product.manufacturer },
    { title: "Origin", value: product.countryOfOrigin },
    { title: "SKU", value: product.sku },
  ];

  return (
    <>
      <Stack spacing={1}>
        {/* PRODUCT NAME */}
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#222",
            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.45rem" },
            lineHeight: 1.25,
          }}
        >
          {product.productName}
        </Typography>

        {/* INLINE CATEGORY + STATUS + BRAND */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          flexWrap="wrap"
          useFlexGap
        >
          {product.category && (
            <Chip
              label={product.category}
              size="small"
              sx={{
                height: 20,
                bgcolor: "#E8F5E9",
                color: "#1B5E20",
                borderRadius: 0,
                fontWeight: 700,
                fontSize: "0.62rem",
              }}
            />
          )}

          {product.status && (
            <Chip
              label={product.status}
              size="small"
              sx={{
                height: 20,
                bgcolor: product.status === "Active" ? "#E8F5E9" : "#F5F5F5",
                color: product.status === "Active" ? "#2E7D32" : "#777",
                borderRadius: 0,
                fontWeight: 600,
                fontSize: "0.62rem",
              }}
            />
          )}

          {product.brand && (
            <Typography sx={{ color: "#666", fontSize: "0.72rem", pl: 0.5 }}>
              Brand:{" "}
              <Box component="span" sx={{ color: "#222", fontWeight: 600 }}>
                {product.brand}
              </Box>
            </Typography>
          )}
        </Stack>

        {/* PRICE + ACTION BUTTONS ROW */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 1.25,
            py: 0.5,
          }}
        >
          <Typography
            sx={{
              color: "#1B5E20",
              fontWeight: 800,
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
              lineHeight: 1.1,
            }}
          >
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                flex: { xs: 1, sm: "initial" },
                minWidth: { sm: 125 },
                height: 34,
                bgcolor: "#1B5E20",
                color: "#fff",
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.72rem",
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
              variant="outlined"
              onClick={handleBuyNow}
              disabled={buyNowLoading}
              sx={{
                flex: { xs: 1, sm: "initial" },
                minWidth: { sm: 115 },
                height: 34,
                borderColor: "#B08D3C",
                color: "#8A6B25",
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.72rem",
                "&:hover": {
                  borderColor: "#8A6B25",
                  bgcolor: "#FBF8EF",
                },
              }}
            >
              {buyNowLoading ? "Adding..." : "Buy Now"}
            </Button>
          </Stack>
        </Box>

        {/* COMPACT 2-LINE SUMMARY DESCRIPTION */}
        {product.description && (
          <Typography
            sx={{
              color: "#666",
              fontSize: { xs: "0.7rem", sm: "0.76rem" },
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
        )}

        <Divider sx={{ my: 0.5 }} />

        {/* COMPACT 2-COLUMN SPECIFICATIONS GRID */}
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#222",
              fontSize: "0.78rem",
              mb: 0.6,
            }}
          >
            Specifications
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              borderTop: "1px solid #E1E6E2",
              borderLeft: "1px solid #E1E6E2",
              bgcolor: "#FAFAFA",
            }}
          >
            {specs.map((item) => (
              <Box
                key={item.title}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  px: 1.1,
                  py: 0.55,
                  borderRight: "1px solid #E1E6E2",
                  borderBottom: "1px solid #E1E6E2",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#666",
                    fontSize: "0.66rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#222",
                    fontWeight: 500,
                    fontSize: "0.66rem",
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.value || "-"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>

      {/* SNACKBAR - TOP CENTER SO IT IS NEVER CLIPPED AT THE BOTTOM */}
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
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          zIndex: 2000,
          mt: { xs: 1, sm: 2 },
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
            borderRadius: 0,
            bgcolor: snackbar.severity === "success" ? "#1B5E20" : undefined,
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.82rem" },
            boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductInfo;