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

const DELIVERY_CHARGE = 50;

const CartSummary = ({ cart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMemberCart =
    location.pathname.startsWith(
      "/member/"
    );

  /*
   * PRODUCT SUBTOTAL ONLY
   */
  const subtotal = Number(
    cart?.totalAmount ??
      cart?.subtotal ??
      0
  );

  /*
   * FIXED DELIVERY
   *
   * ₹50 whenever cart contains products.
   * Never FREE because of subtotal.
   */
  const deliveryCharge =
    cart?.items?.length > 0
      ? DELIVERY_CHARGE
      : 0;

  /*
   * FINAL AMOUNT
   *
   * Product subtotal + delivery.
   */
  const grandTotal =
    subtotal + deliveryCharge;

  const totalItems = Number(
    cart?.totalItems ??
      cart?.totalQuantity ??
      0
  );

  const handleCheckout = () => {
    if (isMemberCart) {
      navigate(
        "/member/checkout"
      );
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

        {/* TOTAL ITEMS */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography>
            Total Items
          </Typography>

          <Typography>
            {totalItems}
          </Typography>
        </Box>

        {/* PRODUCT SUBTOTAL */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography>
            Subtotal
          </Typography>

          <Typography>
            ₹{subtotal}
          </Typography>
        </Box>

        {/* DELIVERY */}

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography>
            Delivery Charges
          </Typography>

          <Typography
            color="success.main"
          >
            ₹{deliveryCharge}
          </Typography>
        </Box>

        <Divider />

        {/* GRAND TOTAL */}

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

        {/* CHECKOUT */}

        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            py: 1.3,
            fontWeight: 700,
            textTransform:
              "none",
            borderRadius: 2,
          }}
          onClick={
            handleCheckout
          }
        >
          Proceed To Checkout
        </Button>

      </Stack>
    </Paper>
  );
};

export default CartSummary;