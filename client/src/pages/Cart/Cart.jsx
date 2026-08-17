import {
  Box,
  Button,
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        py={10}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Shopping Cart
      </Typography>

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={4}
        alignItems="flex-start"
      >
        <Box flex={2}>
          {cart.items.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
            />
          ))}
        </Box>

        <Box flex={1}>
          <CartSummary cart={cart} />
        </Box>
      </Stack>
    </Container>
  );
};

export default Cart;