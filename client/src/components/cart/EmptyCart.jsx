import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMemberCart =
    location.pathname.startsWith("/member/");

  const handleContinueShopping = () => {
    if (isMemberCart) {
      navigate("/member/products");
    } else {
      navigate("/products");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "70vh",

          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          textAlign: "center",

          px: 2,
        }}
      >
        <ShoppingCartOutlinedIcon
          sx={{
            fontSize: {
              xs: 90,
              sm: 120,
            },

            color: "#9E9E9E",

            mb: 3,
          }}
        />

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.7rem",
              sm: "2.2rem",
            },
          }}
        >
          Your Cart is Empty
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 450,
          }}
        >
          Looks like you haven't added any
          products yet. Explore our products
          and start shopping.
        </Typography>

        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleContinueShopping}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            borderRadius: 2,
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default EmptyCart;