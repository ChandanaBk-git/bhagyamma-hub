import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Typography,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

const ProductBanner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        background:
          "linear-gradient(135deg, #1B5E20 0%, #2E7D32 55%, #43A047 100%)",
        color: "#fff",
        py: {
          xs: 2.5,
          sm: 3.5,
          md: 4.5,
        },
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
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          sx={{
            mb: {
              xs: 0.6,
              sm: 0.9,
            },

            "& .MuiBreadcrumbs-separator": {
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.65rem",
            },
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: {
                xs: "0.55rem",
                sm: "0.65rem",
              },
            }}
          >
            Home
          </Link>

          <Typography
            sx={{
              color: "#fff",
              fontSize: {
                xs: "0.55rem",
                sm: "0.65rem",
              },
              fontWeight: 600,
            }}
          >
            Products
          </Typography>
        </Breadcrumbs>

        {/* Heading */}
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "1.35rem",
              sm: "1.8rem",
              md: "2.3rem",
            },
            lineHeight: 1.2,
          }}
        >
          Our Products
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            mt: 0.5,
            maxWidth: 620,
            color: "rgba(255,255,255,0.88)",
            fontSize: {
              xs: "0.6rem",
              sm: "0.72rem",
              md: "0.84rem",
            },
            lineHeight: 1.4,
          }}
        >
          Discover our premium range of natural and high-quality Bhagyamma Hub
          products, carefully selected to support a healthier lifestyle.
        </Typography>
      </Container>
    </Box>
  );
};

export default ProductBanner;