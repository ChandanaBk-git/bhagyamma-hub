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
          xs: 4,
          sm: 5,
          md: 6,
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Breadcrumbs
          sx={{
            mb: 1.5,

            "& .MuiBreadcrumbs-separator": {
              color: "rgba(255,255,255,0.7)",
            },
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{
              color: "rgba(255,255,255,0.85)",

              fontSize: {
                xs: "0.8rem",
                sm: "0.85rem",
              },
            }}
          >
            Home
          </Link>

          <Typography
            sx={{
              color: "#fff",

              fontSize: {
                xs: "0.8rem",
                sm: "0.85rem",
              },

              fontWeight: 600,
            }}
          >
            Products
          </Typography>
        </Breadcrumbs>

        <Typography
          component="h1"
          sx={{
            fontWeight: 800,

            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
            },

            lineHeight: 1.2,
          }}
        >
          Our Products
        </Typography>

        <Typography
          sx={{
            mt: 1.2,

            maxWidth: 700,

            color: "rgba(255,255,255,0.9)",

            fontSize: {
              xs: "0.85rem",
              sm: "0.95rem",
              md: "1rem",
            },

            lineHeight: 1.7,
          }}
        >
          Discover our premium range of natural and
          high-quality Bhagyamma Hub products, carefully
          selected to support a healthier lifestyle.
        </Typography>
      </Container>
    </Box>
  );
};

export default ProductBanner;