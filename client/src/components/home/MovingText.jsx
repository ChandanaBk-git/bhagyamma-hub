import { Box, Typography } from "@mui/material";

// =====================================================
// MARQUEE TEXT
// =====================================================

const marqueeText =
  "BHAGYAMMA HUB • KISRA PRODUCTS • VEDGIRI PRODUCTS • CUSTOMER TRUST •";

// =====================================================
// MOVING ROW
// =====================================================

const MovingRow = ({ direction = "left" }) => {
  const items = Array.from({ length: 8 });

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#FFFFFF",
        color: "#1B5E20",
        py: {
          xs: "4px",
          sm: "6px",
          md: "8px",
        },
        borderTop: "1px solid rgba(27, 94, 32, 0.10)",
        borderBottom: "1px solid rgba(27, 94, 32, 0.10)",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          whiteSpace: "nowrap",
          alignItems: "center",
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
              display: "inline-block",
              whiteSpace: "nowrap",
              px: {
                xs: "10px",
                sm: "18px",
                md: "28px",
              },
              fontSize: {
                xs: "0.50rem",
                sm: "0.65rem",
                md: "0.82rem",
              },
              fontWeight: 700,
              letterSpacing: {
                xs: "0.4px",
                sm: "0.8px",
                md: "1.2px",
              },
              lineHeight: 1.3,
              color: "#1B5E20",
              margin: 0,
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
// MOVING TEXT
// =====================================================

const MovingText = () => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#FFFFFF",
        margin: 0,
        padding: 0,
      }}
    >
      <MovingRow direction="right" />
      <MovingRow direction="left" />
    </Box>
  );
};

export default MovingText;