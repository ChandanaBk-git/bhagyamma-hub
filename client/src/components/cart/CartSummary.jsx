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

import {
  ShoppingCartOutlined,
  LocalShippingOutlined,
  ReceiptLongOutlined,
  ArrowForwardOutlined,
} from "@mui/icons-material";

const DELIVERY_CHARGE = 50;

const CartSummary = ({ cart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // MEMBER CART CHECK
  // =====================================================

  const isMemberCart =
    location.pathname.startsWith("/member/");

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = Number(
    cart?.totalAmount ??
      cart?.subtotal ??
      0
  );

  // =====================================================
  // DELIVERY
  // =====================================================

  const deliveryCharge =
    cart?.items?.length > 0
      ? DELIVERY_CHARGE
      : 0;

  // =====================================================
  // GRAND TOTAL
  // =====================================================

  const grandTotal =
    subtotal + deliveryCharge;

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems = Number(
    cart?.totalItems ??
      cart?.totalQuantity ??
      0
  );

  // =====================================================
  // CHECKOUT
  // =====================================================

  const handleCheckout = () => {
    if (isMemberCart) {
      navigate("/member/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",

        p: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },

        borderRadius: 0,

        border: "1px solid #E1E6E2",

        bgcolor: "#fff",

        position: {
          xs: "static",
          md: "sticky",
        },

        top: 90,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,

          mb: 1,
        }}
      >
        <ReceiptLongOutlined
          sx={{
            color: "#2E7D32",

            fontSize: {
              xs: 19,
              sm: 21,
            },
          }}
        />

        <Typography
          sx={{
            color: "#222",

            fontWeight: 700,

            fontSize: {
              xs: "0.85rem",
              sm: "0.95rem",
              md: "1.05rem",
            },

            lineHeight: 1.2,
          }}
        >
          Order Summary
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "#E8ECE9",
        }}
      />

      <Stack
        spacing={{
          xs: 1,
          sm: 1.2,
        }}
        sx={{
          mt: {
            xs: 1.2,
            sm: 1.5,
          },
        }}
      >
        {/* =================================================
            TOTAL ITEMS
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <ShoppingCartOutlined
              sx={{
                color: "#777",
                fontSize: 16,
              }}
            />

            <Typography
              sx={{
                color: "#666",

                fontSize: {
                  xs: "0.62rem",
                  sm: "0.7rem",
                },
              }}
            >
              Total Items
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#333",

              fontWeight: 600,

              fontSize: {
                xs: "0.65rem",
                sm: "0.72rem",
              },
            }}
          >
            {totalItems}
          </Typography>
        </Box>


        {/* =================================================
            SUBTOTAL
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#666",

              fontSize: {
                xs: "0.62rem",
                sm: "0.7rem",
              },
            }}
          >
            Subtotal
          </Typography>

          <Typography
            sx={{
              color: "#333",

              fontWeight: 600,

              fontSize: {
                xs: "0.65rem",
                sm: "0.72rem",
              },
            }}
          >
            ₹{subtotal}
          </Typography>
        </Box>


        {/* =================================================
            DELIVERY
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <LocalShippingOutlined
              sx={{
                color: "#777",
                fontSize: 16,
              }}
            />

            <Typography
              sx={{
                color: "#666",

                fontSize: {
                  xs: "0.62rem",
                  sm: "0.7rem",
                },
              }}
            >
              Delivery Charges
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#2E7D32",

              fontWeight: 600,

              fontSize: {
                xs: "0.65rem",
                sm: "0.72rem",
              },
            }}
          >
            ₹{deliveryCharge}
          </Typography>
        </Box>


        {/* =================================================
            DIVIDER
        ================================================= */}

        <Divider
          sx={{
            borderColor: "#E8ECE9",
          }}
        />


        {/* =================================================
            GRAND TOTAL
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#222",

              fontWeight: 700,

              fontSize: {
                xs: "0.75rem",
                sm: "0.82rem",
                md: "0.9rem",
              },
            }}
          >
            Grand Total
          </Typography>

          <Typography
            sx={{
              color: "#1B5E20",

              fontWeight: 700,

              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
                md: "1.1rem",
              },
            }}
          >
            ₹{grandTotal}
          </Typography>
        </Box>


        {/* =================================================
            CHECKOUT BUTTON
        ================================================= */}

        <Button
          variant="contained"
          color="success"
          fullWidth
          endIcon={
            <ArrowForwardOutlined
              sx={{
                fontSize: 16,
              }}
            />
          }
          onClick={handleCheckout}
          sx={{
            mt: {
              xs: 0.5,
              sm: 0.8,
            },

            minHeight: {
              xs: 36,
              sm: 40,
            },

            py: 0.6,

            px: 1,

            borderRadius: 0,

            textTransform: "none",

            fontWeight: 700,

            fontSize: {
              xs: "0.65rem",
              sm: "0.72rem",
            },

            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Proceed To Checkout
        </Button>
      </Stack>
    </Paper>
  );
};

export default CartSummary;