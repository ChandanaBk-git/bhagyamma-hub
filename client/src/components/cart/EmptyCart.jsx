import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // MEMBER CART CHECK
  // =====================================================

  const isMemberCart =
    location.pathname.startsWith("/member/");

  // =====================================================
  // CONTINUE SHOPPING
  // =====================================================

  const handleContinueShopping = () => {
    if (isMemberCart) {
      navigate("/member/products");
    } else {
      navigate("/products");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F8FAF8",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >
        <Box
          sx={{
            minHeight: {
              xs: "55vh",
              sm: "60vh",
            },

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",

            alignItems: "center",

            textAlign: "center",

            py: 4,
          }}
        >
          {/* =================================================
              CART ICON
          ================================================= */}

          <Box
            sx={{
              width: {
                xs: 58,
                sm: 68,
              },

              height: {
                xs: 58,
                sm: 68,
              },

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              bgcolor: "#EAF3EB",

              border: "1px solid #D5E4D7",

              borderRadius: 0,

              mb: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{
                fontSize: {
                  xs: 30,
                  sm: 36,
                },

                color: "#2E7D32",
              }}
            />
          </Box>

          {/* =================================================
              TITLE
          ================================================= */}

          <Typography
            component="h1"
            sx={{
              color: "#222",

              fontWeight: 700,

              fontSize: {
                xs: "1.05rem",
                sm: "1.3rem",
              },

              lineHeight: 1.25,
            }}
          >
            Your Cart is Empty
          </Typography>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <Typography
            sx={{
              mt: 0.6,

              color: "#777",

              maxWidth: 380,

              fontSize: {
                xs: "0.62rem",
                sm: "0.7rem",
              },

              lineHeight: 1.5,
            }}
          >
            Looks like you haven't added any
            products yet. Explore our products
            and start shopping.
          </Typography>

          {/* =================================================
              CONTINUE SHOPPING
          ================================================= */}

          <Button
            variant="contained"
            color="success"
            onClick={handleContinueShopping}
            endIcon={
              <ArrowForwardOutlinedIcon
                sx={{
                  fontSize: 16,
                }}
              />
            }
            sx={{
              mt: {
                xs: 1.8,
                sm: 2.2,
              },

              minHeight: {
                xs: 36,
                sm: 40,
              },

              px: {
                xs: 1.8,
                sm: 2.5,
              },

              py: 0.6,

              borderRadius: 0,

              boxShadow: "none",

              textTransform: "none",

              fontWeight: 700,

              fontSize: {
                xs: "0.65rem",
                sm: "0.72rem",
              },

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EmptyCart;