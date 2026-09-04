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
          xs: "3px",
          sm: "5px",
          md: "7px",
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
                xs: "8px",
                sm: "14px",
                md: "22px",
              },

              fontSize: {
                xs: "0.46rem",
                sm: "0.6rem",
                md: "0.78rem",
              },

              fontWeight: 800,

              letterSpacing: {
                xs: "0.4px",
                sm: "0.7px",
                md: "1.1px",
              },

              lineHeight: 1.35,
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

        // =================================================
        // COMPACT HERO SIZE
        // =================================================

        height: {
          xs: "240px",
          sm: "320px",
          md: "calc(100vh - 75px)",
        },

        minHeight: {
          xs: "240px",
          sm: "320px",
          md: "600px",
        },

        maxHeight: {
          xs: "240px",
          sm: "320px",
          md: "none",
        },

        overflow: "hidden",

        // =================================================
        // BACKGROUND
        // =================================================

        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.42),
            rgba(0, 0, 0, 0.42)
          ),
          url(${banner})
        `,

        backgroundRepeat: "no-repeat",

        backgroundSize: "cover",

        backgroundPosition: {
          xs: "center center",
          sm: "center center",
          md: "center center",
        },

        backgroundColor: "#f8f5ef",

        display: "flex",

        alignItems: "center",
      }}
    >
      {/* =================================================
          TOP MARQUEE
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
          FIXED TO LOWER PART OF HERO
      ================================================= */}

      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          position: "absolute",

          left: 0,
          right: 0,

          bottom: {
            xs: "25px",
            sm: "32px",
            md: "70px",
          },

          zIndex: 3,

          width: "100%",

          px: {
            xs: "16px",
            sm: "24px",
            md: "48px",
          },
        }}
      >
        <Stack
          sx={{
            width: "100%",

            maxWidth: {
              xs: "320px",
              sm: "560px",
              md: "700px",
            },

            gap: {
              xs: "5px",
              sm: "10px",
              md: "18px",
            },
          }}
        >
          {/* =================================================
              TITLE
          ================================================= */}

          <Typography
            component="h1"
            sx={{
              margin: 0,

              color: "#fff",

              fontWeight: 900,

              fontSize: {
                xs: "1.05rem",
                sm: "1.8rem",
                md: "3.8rem",
              },

              lineHeight: 1.1,

              textShadow:
                "0 2px 6px rgba(0,0,0,.7)",
            }}
          >
            Bhagyamma Hub
          </Typography>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <Typography
            sx={{
              margin: 0,

              color: "#fff",

              fontSize: {
                xs: "0.60rem",
                sm: "0.78rem",
                md: "1.15rem",
              },

              lineHeight: {
                xs: 1.3,
                sm: 1.4,
                md: 1.55,
              },

              maxWidth: {
                xs: "290px",
                sm: "500px",
                md: "650px",
              },

              textShadow:
                "0 1px 4px rgba(0,0,0,.8)",
            }}
          >
            Experience the power of nature with premium
            herbal, skincare and wellness products crafted
            for a healthier lifestyle.
          </Typography>

          {/* =================================================
              BUTTONS
              SMALL + SIDE BY SIDE
          ================================================= */}

          <Stack
            direction="row"
            spacing={{
              xs: "7px",
              sm: "10px",
              md: "14px",
            }}
            sx={{
              width: "fit-content",

              maxWidth: "100%",

              mt: {
                xs: "3px",
                sm: "5px",
                md: "8px",
              },
            }}
          >
            {/* =================================================
                SHOP NOW
            ================================================= */}

            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="success"
              sx={{
                minWidth: "auto",

                width: {
                  xs: "105px",
                  sm: "125px",
                  md: "150px",
                },

                height: {
                  xs: "28px",
                  sm: "36px",
                  md: "46px",
                },

                padding: 0,

                borderRadius: {
                  xs: "14px",
                  sm: "18px",
                  md: "23px",
                },

                textTransform: "none",

                fontWeight: 700,

                fontSize: {
                  xs: "0.60rem",
                  sm: "0.74rem",
                  md: "0.92rem",
                },

                lineHeight: 1,

                whiteSpace: "nowrap",

                boxShadow:
                  "0 2px 5px rgba(0,0,0,.25)",

                "&:hover": {
                  bgcolor: "#43A047",
                },
              }}
            >
              Shop Now
            </Button>

            {/* =================================================
                LEARN MORE
            ================================================= */}

            <Button
              component={Link}
              to="/about"
              variant="outlined"
              sx={{
                minWidth: "auto",

                width: {
                  xs: "105px",
                  sm: "125px",
                  md: "150px",
                },

                height: {
                  xs: "28px",
                  sm: "36px",
                  md: "46px",
                },

                padding: 0,

                borderRadius: {
                  xs: "14px",
                  sm: "18px",
                  md: "23px",
                },

                border:
                  "1px solid rgba(255,255,255,0.95)",

                bgcolor:
                  "rgba(0,0,0,0.18)",

                color: "#fff",

                textTransform: "none",

                fontWeight: 700,

                fontSize: {
                  xs: "0.60rem",
                  sm: "0.74rem",
                  md: "0.92rem",
                },

                lineHeight: 1,

                whiteSpace: "nowrap",

                backdropFilter: "blur(2px)",

                "&:hover": {
                  borderColor: "#fff",

                  bgcolor:
                    "rgba(0,0,0,0.28)",
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* =================================================
          BOTTOM MARQUEE
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