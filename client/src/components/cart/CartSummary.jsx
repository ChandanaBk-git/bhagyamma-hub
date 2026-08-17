import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const CartSummary = ({ cart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMemberCart =
    location.pathname.startsWith("/member/");

  const deliveryCharge =
    cart.totalAmount >= 500 ? 0 : 50;

  const grandTotal =
    cart.totalAmount + deliveryCharge;

  const handleCheckout = () => {
    if (isMemberCart) {
      navigate("/member/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },

        borderRadius: 3,

        position: {
          xs: "static",
          md: "sticky",
        },

        top: 100,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        Order Summary
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {/* Total Items */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography>
            Total Items
          </Typography>

          <Typography>
            {cart.totalItems}
          </Typography>
        </Box>

        {/* Subtotal */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography>
            Subtotal
          </Typography>

          <Typography>
            ₹{cart.totalAmount}
          </Typography>
        </Box>

        {/* Delivery */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography>
            Delivery Charges
          </Typography>

          <Typography
            color={
              deliveryCharge === 0
                ? "success.main"
                : "text.primary"
            }
          >
            {deliveryCharge === 0
              ? "FREE"
              : `₹${deliveryCharge}`}
          </Typography>
        </Box>

        <Divider />

        {/* Grand Total */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography
            fontWeight="bold"
            variant="h6"
          >
            Grand Total
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
          >
            ₹{grandTotal}
          </Typography>
        </Box>

        {/* Checkout */}

        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            py: 1.3,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 2,
          }}
          onClick={handleCheckout}
        >
          Proceed To Checkout
        </Button>
      </Stack>
    </Paper>
  );
};

export default CartSummary;