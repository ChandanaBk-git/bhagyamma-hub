import { Box, Typography } from "@mui/material";

const marqueeText =
  "BHAGYAMMA HUB • PREMIUM HERBAL & WELLNESS PRODUCTS • QUALITY • TRUST • WELLNESS • OPPORTUNITY •";

const MovingRow = ({ direction }) => {
  const items = Array.from({ length: 6 });

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#1B5E20",
        color: "#fff",
        py: {
          xs: 1,
          sm: 1.3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",

          animation:
            direction === "right"
              ? "marqueeRight 28s linear infinite"
              : "marqueeLeft 28s linear infinite",

          "@keyframes marqueeRight": {
            "0%": {
              transform: "translateX(-50%)",
            },
            "100%": {
              transform: "translateX(0)",
            },
          },

          "@keyframes marqueeLeft": {
            "0%": {
              transform: "translateX(0)",
            },
            "100%": {
              transform: "translateX(-50%)",
            },
          },
        }}
      >
        {items.map((_, index) => (
          <Typography
            key={index}
            component="span"
            sx={{
              whiteSpace: "nowrap",

              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              fontSize: {
                xs: "0.7rem",
                sm: "0.85rem",
                md: "0.95rem",
              },

              fontWeight: 700,

              letterSpacing: {
                xs: 1,
                sm: 1.5,
              },
            }}
          >
            {marqueeText}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const MovingText = () => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* TOP — LEFT TO RIGHT */}
      <MovingRow direction="right" />

      {/* BOTTOM — RIGHT TO LEFT */}
      <MovingRow direction="left" />
    </Box>
  );
};

export default MovingText;