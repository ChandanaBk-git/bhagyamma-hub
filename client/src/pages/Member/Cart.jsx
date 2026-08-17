import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";

const Cart = () => {
  const { cart, loading } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // Check whether the cart is being viewed
  // inside the member section.
  const isMemberCart = location.pathname.startsWith("/member/");

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress color="success" />
      </Container>
    );
  }

  // --------------------------------------------------
  // Empty Cart
  // --------------------------------------------------

  if (!cart || !cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  // --------------------------------------------------
  // Checkout
  // --------------------------------------------------

  const handleCheckout = () => {
    if (isMemberCart) {
      navigate("/member/checkout");
    } else {
      navigate("/checkout");
    }
  };

  // --------------------------------------------------
  // Cart
  // --------------------------------------------------

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 4,
          fontSize: {
            xs: "1.7rem",
            sm: "2rem",
            md: "2.2rem",
          },
        }}
      >
        My Cart
      </Typography>

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={{
          xs: 3,
          md: 4,
        }}
        alignItems="flex-start"
      >
        {/* ==========================================
            CART ITEMS
        ========================================== */}

        <Box
          sx={{
            flex: 2,
            width: "100%",
          }}
        >
          {cart.items.map((item) => (
            <CartItem
              key={item.product?._id || item.product}
              item={item}
            />
          ))}
        </Box>

        {/* ==========================================
            CART SUMMARY
        ========================================== */}

        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: {
              xs: "100%",
              md: "420px",
            },
          }}
        >
          <CartSummary cart={cart} />

          {/* ========================================
              CHECKOUT BUTTON
          ======================================== */}

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleCheckout}
            sx={{
              mt: 2,
              py: 1.4,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default Cart;