import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { useCart } from "../../context/CartContext";

const ProductInfo = ({
  product,
}) => {
  const navigate =
    useNavigate();

  const { addToCart } =
    useCart();

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });

  const handleAddToCart =
    async () => {
      try {
        /*
        Guests are allowed.

        CartContext decides whether
        to use localStorage or
        MongoDB.
        */

        const result =
          await addToCart(
            product,
            1
          );

        if (result?.success) {
          setSnackbar({
            open: true,
            severity:
              "success",
            message:
              "Product added to cart successfully.",
          });

          return;
        }

        setSnackbar({
          open: true,
          severity:
            "error",
          message:
            result?.error
              ?.response?.data
              ?.message ||
            result?.error
              ?.message ||
            "Unable to add product.",
        });
      } catch (error) {
        console.error(
          "Add To Cart Error:",
          error
        );

        setSnackbar({
          open: true,
          severity:
            "error",
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
      <Stack spacing={2}>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          {product.productName}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
        >
          <Chip
            label={
              product.category
            }
            color="success"
          />

          <Chip
            label={
              product.status
            }
            color={
              product.status ===
              "Active"
                ? "primary"
                : "default"
            }
          />
        </Stack>

        <Typography color="text.secondary">
          Brand :{" "}
          {product.brand}
        </Typography>

        <Typography
          variant="h3"
          color="success.main"
          fontWeight="bold"
        >
          ₹{product.price}
        </Typography>

        <Divider />

        <Typography
          sx={{
            lineHeight: 1.8,
          }}
        >
          {
            product.description
          }
        </Typography>

        <Divider />

        <Typography
          variant="h6"
          fontWeight={600}
        >
          Product Specifications
        </Typography>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          <Specification
            title="Category"
            value={
              product.category
            }
          />

          <Specification
            title="Brand"
            value={
              product.brand
            }
          />

          <Specification
            title="Weight"
            value={
              product.weight ||
              "-"
            }
          />

          <Specification
            title="Quantity"
            value={
              product.quantity ||
              "-"
            }
          />

          <Specification
            title="Shelf Life"
            value={
              product.shelfLife ||
              "-"
            }
          />

          <Specification
            title="Manufacturer"
            value={
              product.manufacturer
            }
          />

          <Specification
            title="Country Of Origin"
            value={
              product.countryOfOrigin
            }
          />

          <Specification
            title="SKU"
            value={
              product.sku ||
              "-"
            }
          />
        </Paper>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            onClick={
              handleAddToCart
            }
          >
            Add To Cart
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="success"
            size="large"
            onClick={() =>
              navigate(
                "/cart"
              )
            }
          >
            Buy Now
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          3000
        }
        onClose={() =>
          setSnackbar(
            (prev) => ({
              ...prev,
              open: false,
            })
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={
            snackbar.severity
          }
          variant="filled"
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

const Specification = ({
  title,
  value,
}) => (
  <>
    <Box
      display="flex"
      justifyContent="space-between"
      py={1}
    >
      <Typography fontWeight={600}>
        {title}
      </Typography>

      <Typography>
        {value}
      </Typography>
    </Box>

    <Divider />
  </>
);

export default ProductInfo;