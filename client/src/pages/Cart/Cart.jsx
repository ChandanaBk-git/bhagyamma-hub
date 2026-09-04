import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { useCart } from "../../context/CartContext";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";

const Cart = () => {
  const { cart, loading } = useCart();

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "45vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F8FAF8",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircularProgress
            color="success"
            size={28}
          />

          <Typography
            sx={{
              color: "#777",
              fontSize: "0.68rem",
            }}
          >
            Loading cart...
          </Typography>
        </Box>
      </Box>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!cart || !cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  // =====================================================
  // CART
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
            PAGE HEADER
        ================================================= */}

        <Box
          sx={{
            mb: {
              xs: 1.8,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: "#222",

              fontWeight: 700,

              fontSize: {
                xs: "1.2rem",
                sm: "1.5rem",
                md: "1.8rem",
              },

              lineHeight: 1.2,
            }}
          >
            Shopping Cart
          </Typography>

          <Typography
            sx={{
              mt: 0.4,

              color: "#777",

              fontSize: {
                xs: "0.62rem",
                sm: "0.7rem",
                md: "0.78rem",
              },
            }}
          >
            Review your selected products before checkout.
          </Typography>
        </Box>

        {/* =================================================
            CART CONTENT
        ================================================= */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            sm: 2.5,
            md: 3,
          }}
          alignItems="flex-start"
        >
          {/* =================================================
              CART ITEMS
          ================================================= */}

          <Box
            sx={{
              width: "100%",
              flex: 2,

              minWidth: 0,

              display: "flex",
              flexDirection: "column",

              gap: {
                xs: 1,
                sm: 1.5,
              },
            }}
          >
            {/* ITEM COUNT */}

            <Typography
              sx={{
                color: "#555",

                fontWeight: 600,

                fontSize: {
                  xs: "0.65rem",
                  sm: "0.72rem",
                },

                mb: 0.2,
              }}
            >
              {cart.items.length}{" "}
              {cart.items.length === 1
                ? "Item"
                : "Items"}
            </Typography>

            {/* ITEMS */}

            {cart.items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
              />
            ))}
          </Box>

          {/* =================================================
              CART SUMMARY
          ================================================= */}

          <Box
            sx={{
              width: "100%",

              flex: 1,

              minWidth: 0,

              position: {
                xs: "static",
                md: "sticky",
              },

              top: {
                md: 90,
              },
            }}
          >
            <CartSummary cart={cart} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Cart;