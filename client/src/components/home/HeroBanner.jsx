import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import banner from "../../assets/banner/banner.jpg";

const HeroBanner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: {
          xs: "70vh",
          md: "90vh",
        },
        backgroundImage: `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} maxWidth={600}>
          <Typography
            variant="h2"
            fontWeight={900}
            color="#fff"
            sx={{
              fontSize: {
                xs: "2.2rem",
                md: "4rem",
              },
            }}
          >
            Bhagyamma Hub

          </Typography>

          <Typography
            sx={{
              color: "#F5F5F5",
              fontSize: {
                xs: 16,
                md: 20,
              },
            }}
          >
            Experience the power of nature with premium herbal,
            skincare and wellness products crafted for a healthier
            lifestyle.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="success"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Shop Now
            </Button>

            <Button
              component={Link}
              to="/about"
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                borderColor: "#fff",
                color: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,.15)",
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroBanner;