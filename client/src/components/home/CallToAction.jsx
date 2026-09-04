import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

const CallToAction = () => {
  return (
    <Box
      sx={{
        bgcolor: "#F7F5EF",
        color: "#1B5E20",
        py: {
          xs: 2.5,
          sm: 3.5,
          md: 4,
        },
        borderTop: "1px solid #E8E3D8",
        borderBottom: "1px solid #E8E3D8",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          {/* Heading */}
          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.5rem",
                md: "1.9rem",
              },
              lineHeight: 1.2,
            }}
          >
            Ready to Start Your Journey?
          </Typography>

          {/* Gold Accent */}
          <Box
            sx={{
              width: 35,
              height: 2,
              bgcolor: "#B08D3C",
              mx: "auto",
              my: 0.8,
            }}
          />

          {/* Description */}
          <Typography
            sx={{
              color: "#555",
              maxWidth: 650,
              mx: "auto",
              fontSize: {
                xs: "0.62rem",
                sm: "0.75rem",
                md: "0.85rem",
              },
              lineHeight: 1.45,
            }}
          >
            Join the Bhagyamma Hub community today. Explore our premium
            products, become a member, and take the first step toward a
            healthier lifestyle and exciting business opportunities.
          </Typography>

          {/* Buttons */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={{
              xs: 0.7,
              sm: 1.2,
            }}
            sx={{
              mt: {
                xs: 1.5,
                sm: 2,
              },
              width: "100%",
            }}
          >
            {/* Explore Products */}
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              sx={{
                height: {
                  xs: 30,
                  sm: 35,
                },
                minWidth: {
                  xs: 85,
                  sm: 115,
                },
                px: {
                  xs: 1,
                  sm: 2,
                },
                bgcolor: "#1B5E20",
                color: "#fff",
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 700,
                fontSize: {
                  xs: "0.5rem",
                  sm: "0.65rem",
                },
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#154A19",
                  boxShadow: "none",
                },
              }}
            >
              Explore Products
            </Button>

            {/* Join Membership */}
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                height: {
                  xs: 30,
                  sm: 35,
                },
                minWidth: {
                  xs: 85,
                  sm: 115,
                },
                px: {
                  xs: 1,
                  sm: 2,
                },
                bgcolor: "#B08D3C",
                color: "#fff",
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 700,
                fontSize: {
                  xs: "0.5rem",
                  sm: "0.65rem",
                },
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#96752F",
                  boxShadow: "none",
                },
              }}
            >
              Join Membership
            </Button>

            {/* Contact Us */}
            <Button
              component={RouterLink}
              to="/contact"
              variant="outlined"
              sx={{
                height: {
                  xs: 30,
                  sm: 35,
                },
                minWidth: {
                  xs: 70,
                  sm: 95,
                },
                px: {
                  xs: 1,
                  sm: 1.8,
                },
                color: "#1B5E20",
                borderColor: "#1B5E20",
                borderWidth: "1px",
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 600,
                fontSize: {
                  xs: "0.5rem",
                  sm: "0.65rem",
                },
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: "#1B5E20",
                  borderWidth: "1px",
                  bgcolor: "rgba(27,94,32,0.05)",
                },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CallToAction;