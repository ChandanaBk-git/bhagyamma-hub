import { useState } from "react";

import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
} from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { membershipBenefits } from "../../utils/dummyData";

const MembershipBenefits = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalBenefits = membershipBenefits.length;

  const handleNext = () => {
    setActiveIndex((current) =>
      current === totalBenefits - 1 ? 0 : current + 1
    );
  };

  const handlePrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? totalBenefits - 1 : current - 1
    );
  };

  const activeBenefit = membershipBenefits[activeIndex];

  return (
    <Box
      sx={{
        width: "100%",
        background:
          "linear-gradient(135deg, #2E7D32, #1B5E20)",
        color: "#FFFFFF",
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
        }}
      >
        {/* ================================
            HEADING
        ================================= */}

        <Box
          sx={{
            textAlign: "center",
            mb: {
              xs: 2,
              sm: 3,
              md: 3.5,
            },
          }}
        >
          <Typography
            component="h2"
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: {
                xs: "1.25rem",
                sm: "1.7rem",
                md: "2.2rem",
              },
              lineHeight: 1.2,
            }}
          >
            Become a Member Today
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: "rgba(255,255,255,0.85)",
              fontSize: {
                xs: "0.65rem",
                sm: "0.78rem",
                md: "0.9rem",
              },
              lineHeight: 1.45,
            }}
          >
            Unlock exclusive benefits by joining the
            Bhagyamma Hub family.
          </Typography>
        </Box>

        {/* ================================
            SINGLE BENEFIT
        ================================= */}

        {activeBenefit && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              bgcolor: "#FFFFFF",

              minHeight: {
                xs: "165px",
                sm: "190px",
                md: "210px",
              },

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              px: {
                xs: 5,
                sm: 7,
                md: 9,
              },

              py: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },

              boxSizing: "border-box",
            }}
          >
            {/* ================================
                PREVIOUS BUTTON
            ================================= */}

            <IconButton
              onClick={handlePrevious}
              aria-label="Previous benefit"
              sx={{
                position: "absolute",

                left: {
                  xs: 7,
                  sm: 12,
                  md: 16,
                },

                top: "50%",

                transform: "translateY(-50%)",

                width: {
                  xs: 30,
                  sm: 36,
                  md: 42,
                },

                height: {
                  xs: 30,
                  sm: 36,
                  md: 42,
                },

                border:
                  "1px solid #B7D7BA",

                borderRadius: 0,

                color: "#1B5E20",

                bgcolor: "#F5FAF6",

                "&:hover": {
                  bgcolor: "#E8F5E9",
                },
              }}
            >
              <ArrowBackIosNewIcon
                sx={{
                  fontSize: {
                    xs: 10,
                    sm: 12,
                    md: 14,
                  },
                }}
              />
            </IconButton>

            {/* ================================
                BENEFIT CONTENT
            ================================= */}

            <Box
              sx={{
                width: "100%",
                maxWidth: "520px",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "30px",
                    sm: "38px",
                    md: "45px",
                  },

                  lineHeight: 1,

                  mb: {
                    xs: 1,
                    sm: 1.2,
                    md: 1.5,
                  },
                }}
              >
                {activeBenefit.icon}
              </Typography>

              <Typography
                component="h3"
                sx={{
                  color: "#1B5E20",

                  fontWeight: 700,

                  fontSize: {
                    xs: "0.85rem",
                    sm: "1rem",
                    md: "1.2rem",
                  },

                  lineHeight: 1.3,

                  mb: {
                    xs: 0.6,
                    sm: 0.8,
                  },
                }}
              >
                {activeBenefit.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.62rem",
                    sm: "0.72rem",
                    md: "0.82rem",
                  },

                  lineHeight: 1.5,

                  display: "-webkit-box",

                  WebkitLineClamp: {
                    xs: 3,
                    sm: 3,
                    md: 4,
                  },

                  WebkitBoxOrient: "vertical",

                  overflow: "hidden",
                }}
              >
                {activeBenefit.description}
              </Typography>
            </Box>

            {/* ================================
                NEXT BUTTON
            ================================= */}

            <IconButton
              onClick={handleNext}
              aria-label="Next benefit"
              sx={{
                position: "absolute",

                right: {
                  xs: 7,
                  sm: 12,
                  md: 16,
                },

                top: "50%",

                transform: "translateY(-50%)",

                width: {
                  xs: 30,
                  sm: 36,
                  md: 42,
                },

                height: {
                  xs: 30,
                  sm: 36,
                  md: 42,
                },

                border:
                  "1px solid #B7D7BA",

                borderRadius: 0,

                color: "#1B5E20",

                bgcolor: "#F5FAF6",

                "&:hover": {
                  bgcolor: "#E8F5E9",
                },
              }}
            >
              <ArrowForwardIosIcon
                sx={{
                  fontSize: {
                    xs: 10,
                    sm: 12,
                    md: 14,
                  },
                }}
              />
            </IconButton>
          </Box>
        )}

        {/* ================================
            COUNTER
        ================================= */}

        <Typography
          textAlign="center"
          sx={{
            mt: 1,

            color:
              "rgba(255,255,255,0.8)",

            fontSize: {
              xs: "0.55rem",
              sm: "0.65rem",
              md: "0.72rem",
            },

            letterSpacing: "1px",
          }}
        >
          {activeIndex + 1} / {totalBenefits}
        </Typography>

        {/* ================================
            JOIN BUTTON
        ================================= */}

        <Box
          sx={{
            textAlign: "center",

            mt: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              height: {
                xs: 32,
                sm: 36,
                md: 42,
              },

              px: {
                xs: 2.5,
                sm: 3.5,
                md: 4.5,
              },

              borderRadius: 0,

              textTransform: "none",

              fontWeight: 700,

              fontSize: {
                xs: "0.6rem",
                sm: "0.7rem",
                md: "0.82rem",
              },

              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Join Membership
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MembershipBenefits;