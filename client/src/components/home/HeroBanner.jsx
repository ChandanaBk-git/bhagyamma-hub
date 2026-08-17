import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import banner from "../../assets/banner/banner.jpg";

// =====================================================
// MARQUEE TEXT
// =====================================================

const marqueeText =
  "BHAGYAMMA HUB • PREMIUM HERBAL & WELLNESS PRODUCTS • QUALITY • TRUST • WELLNESS • OPPORTUNITY •";

// =====================================================
// MOVING ROW
// =====================================================

const MovingRow = ({ direction = "left" }) => {
  const repeatedItems = Array.from({ length: 8 });

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#1B5E20",
        color: "#fff",
        py: {
          xs: 1,
          sm: 1.2,
          md: 1.4,
        },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          whiteSpace: "nowrap",

          animation:
            direction === "right"
              ? "moveRight 28s linear infinite"
              : "moveLeft 28s linear infinite",

          "@keyframes moveLeft": {
            "0%": {
              transform: "translateX(0)",
            },
            "100%": {
              transform: "translateX(-50%)",
            },
          },

          "@keyframes moveRight": {
            "0%": {
              transform: "translateX(-50%)",
            },
            "100%": {
              transform: "translateX(0)",
            },
          },
        }}
      >
        {repeatedItems.map((_, index) => (
          <Typography
            key={index}
            component="span"
            sx={{
              display: "inline-block",
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              fontSize: {
                xs: "0.7rem",
                sm: "0.82rem",
                md: "0.95rem",
              },

              fontWeight: 800,

              letterSpacing: {
                xs: 1,
                sm: 1.4,
                md: 1.8,
              },

              lineHeight: 1.5,
            }}
          >
            {marqueeText}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// =====================================================
// HERO BANNER
// =====================================================

const HeroBanner = () => {
  return (
    <Box
      sx={{
        position: "relative",

        width: "100%",

        height: {
          xs: "70vh",
          sm: "72vh",
          md: "calc(100vh - 75px)",
        },

        minHeight: {
          xs: 520,
          md: 650,
        },

        overflow: "hidden",

        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,.45),
            rgba(0,0,0,.45)
          ),
          url(${banner})
        `,

        backgroundRepeat: "no-repeat",

        backgroundSize: {
          xs: "cover",
          sm: "cover",
          md: "cover",
        },

        backgroundPosition: {
          xs: "center",
          sm: "center",
          md: "center",
        },

        backgroundColor: "#f8f5ef",

        display: "flex",

        alignItems: "center",
      }}
    >
      {/* =================================================
          TOP MOVING TEXT
          LEFT → RIGHT
      ================================================= */}

      <Box
        sx={{
          position: "absolute",

          top: 0,

          left: 0,

          width: "100%",

          zIndex: 5,
        }}
      >
        <MovingRow direction="right" />
      </Box>

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",

          zIndex: 3,

          px: {
            xs: 3,
            sm: 4,
            md: 6,
          },
        }}
      >
        <Stack
          spacing={{
            xs: 2,
            sm: 2.5,
            md: 3,
          }}
          maxWidth={700}
        >
          {/* HERO TITLE */}

          <Typography
            variant="h2"
            fontWeight={900}
            color="#fff"
            sx={{
              fontSize: {
                xs: "2.2rem",
                sm: "3rem",
                md: "4rem",
              },

              lineHeight: 1.1,

              textShadow:
                "0 3px 10px rgba(0,0,0,.4)",
            }}
          >
            Bhagyamma Hub
          </Typography>

          {/* HERO DESCRIPTION */}

          <Typography
            sx={{
              color: "#F5F5F5",

              fontSize: {
                xs: 16,
                sm: 18,
                md: 20,
              },

              lineHeight: 1.6,

              textShadow:
                "0 2px 8px rgba(0,0,0,.5)",
            }}
          >
            Experience the power of nature with premium
            herbal, skincare and wellness products crafted
            for a healthier lifestyle.
          </Typography>

          {/* BUTTONS */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
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

                width: {
                  xs: "100%",
                  sm: "auto",
                },
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

                textTransform: "none",

                fontWeight: 700,

                width: {
                  xs: "100%",
                  sm: "auto",
                },

                "&:hover": {
                  borderColor: "#fff",

                  bgcolor:
                    "rgba(255,255,255,.15)",
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* =================================================
          BOTTOM MOVING TEXT
          RIGHT → LEFT
      ================================================= */}

      <Box
        sx={{
          position: "absolute",

          bottom: 0,

          left: 0,

          width: "100%",

          zIndex: 5,
        }}
      >
        <MovingRow direction="left" />
      </Box>
    </Box>
  );
};

export default HeroBanner;