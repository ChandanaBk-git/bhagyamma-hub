import { useState } from "react";

import {
  Box,
  Container,
  IconButton,
  Typography,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { whyBhagyamma } from "../../utils/dummyData";

const WhyBhagyamma = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = whyBhagyamma.length;

  const handlePrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? totalItems - 1
        : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) =>
      current === totalItems - 1
        ? 0
        : current + 1
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#1B5E20",
        color: "#FFFFFF",

        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
        }}
      >
        {/* =================================================
            HEADING
        ================================================= */}

        <Box
          sx={{
            textAlign: "center",

            mb: {
              xs: 2,
              sm: 3,
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
                sm: "1.6rem",
                md: "2rem",
              },

              lineHeight: 1.2,
            }}
          >
            Why Bhagyamma Hub?
          </Typography>

          <Typography
            sx={{
              color:
                "rgba(255,255,255,0.82)",

              mt: 0.5,

              fontSize: {
                xs: "0.65rem",
                sm: "0.75rem",
                md: "0.9rem",
              },
            }}
          >
            More than products, we create opportunities.
          </Typography>
        </Box>

        {/* =================================================
            MOBILE
            TWO BOXES + ARROWS
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },

            alignItems: "stretch",

            gap: 1,

            width: "100%",
          }}
        >
          {[0, 1].map((offset) => {
            const itemIndex =
              (activeIndex + offset) %
              totalItems;

            const item =
              whyBhagyamma[itemIndex];

            return (
              <Box
                key={`${item.id}-${itemIndex}`}
                sx={{
                  flex: 1,

                  minWidth: 0,

                  minHeight: "145px",

                  border:
                    "1px solid rgba(255,255,255,0.35)",

                  bgcolor:
                    "rgba(255,255,255,0.06)",

                  px: 1.2,

                  py: 1.4,

                  display: "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "flex-start",
                }}
              >
                {/* NUMBER */}

                <Typography
                  sx={{
                    color: "#A5D6A7",

                    fontWeight: 700,

                    fontSize: "0.6rem",

                    letterSpacing: "1px",

                    mb: 0.8,
                  }}
                >
                  {String(
                    itemIndex + 1
                  ).padStart(2, "0")}
                </Typography>

                {/* ICON */}

                <Typography
                  sx={{
                    fontSize: "20px",

                    lineHeight: 1,

                    mb: 0.7,
                  }}
                >
                  {item.icon}
                </Typography>

                {/* TITLE */}

                <Typography
                  sx={{
                    color: "#FFFFFF",

                    fontWeight: 700,

                    fontSize: "0.68rem",

                    lineHeight: 1.25,

                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>

                {/* DESCRIPTION */}

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.75)",

                    fontSize: "0.52rem",

                    lineHeight: 1.4,

                    display:
                      "-webkit-box",

                    WebkitLineClamp: 3,

                    WebkitBoxOrient:
                      "vertical",

                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* =================================================
            MOBILE ARROWS
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },

            justifyContent: "center",

            alignItems: "center",

            gap: 1,

            mt: 1.5,
          }}
        >
          <IconButton
            onClick={handlePrevious}
            aria-label="Previous"
            sx={{
              width: "30px",

              height: "30px",

              border:
                "1px solid rgba(255,255,255,0.45)",

              borderRadius: 0,

              color: "#FFFFFF",

              bgcolor:
                "rgba(255,255,255,0.06)",

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,0.15)",
              },
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                fontSize: "12px",
              }}
            />
          </IconButton>

          <Typography
            sx={{
              color:
                "rgba(255,255,255,0.7)",

              fontSize: "0.55rem",

              minWidth: "32px",

              textAlign: "center",
            }}
          >
            {activeIndex + 1}/{totalItems}
          </Typography>

          <IconButton
            onClick={handleNext}
            aria-label="Next"
            sx={{
              width: "30px",

              height: "30px",

              border:
                "1px solid rgba(255,255,255,0.45)",

              borderRadius: 0,

              color: "#FFFFFF",

              bgcolor:
                "rgba(255,255,255,0.06)",

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,0.15)",
              },
            }}
          >
            <ArrowForwardIosIcon
              sx={{
                fontSize: "12px",
              }}
            />
          </IconButton>
        </Box>

        {/* =================================================
            DESKTOP
            FOUR CLEAN BOXES
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "grid",
            },

            gridTemplateColumns:
              "repeat(4, 1fr)",

            gap: 2,
          }}
        >
          {whyBhagyamma.map(
            (item, index) => (
              <Box
                key={item.id}
                sx={{
                  minHeight: "165px",

                  border:
                    "1px solid rgba(255,255,255,0.35)",

                  bgcolor:
                    "rgba(255,255,255,0.06)",

                  px: 2,

                  py: 2,

                  display: "flex",

                  flexDirection:
                    "column",
                }}
              >
                {/* NUMBER */}

                <Typography
                  sx={{
                    color: "#A5D6A7",

                    fontSize: "0.7rem",

                    fontWeight: 700,

                    letterSpacing: "1px",

                    mb: 1,
                  }}
                >
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </Typography>

                {/* ICON */}

                <Typography
                  sx={{
                    fontSize: "24px",

                    lineHeight: 1,

                    mb: 0.8,
                  }}
                >
                  {item.icon}
                </Typography>

                {/* TITLE */}

                <Typography
                  sx={{
                    color: "#FFFFFF",

                    fontWeight: 700,

                    fontSize: "0.9rem",

                    lineHeight: 1.3,

                    mb: 0.6,
                  }}
                >
                  {item.title}
                </Typography>

                {/* DESCRIPTION */}

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.76)",

                    fontSize: "0.68rem",

                    lineHeight: 1.45,

                    display:
                      "-webkit-box",

                    WebkitLineClamp: 3,

                    WebkitBoxOrient:
                      "vertical",

                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default WhyBhagyamma;