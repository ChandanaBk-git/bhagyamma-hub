import { Box, Typography } from "@mui/material";

const marqueeText =
  "BHAGYAMMA HUB • KISRA PRODUCTS • VEDGIRI PRODUCTS • CUSTOMER TRUST •";

const MovingText = ({ direction = "left" }) => {
  const animationName =
    direction === "right" ? "marqueeRight" : "marqueeLeft";

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#fff",
        color: "#1B5E20",
        py: { xs: "4px", sm: "6px" },
        borderTop: "1px solid rgba(27,94,32,.08)",
        borderBottom: "1px solid rgba(27,94,32,.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          animation: `${animationName} 45s linear infinite`,
          willChange: "transform",
          "@keyframes marqueeLeft": {
            from: { transform: "translateX(0)" },
            to: { transform: "translateX(-50%)" },
          },
          "@keyframes marqueeRight": {
            from: { transform: "translateX(-50%)" },
            to: { transform: "translateX(0)" },
          },
        }}
      >
        {[0, 1].map((copy) => (
          <Box
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            sx={{ display: "flex", flexShrink: 0 }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Typography
                key={index}
                component="span"
                sx={{
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: "8px", sm: "10px", md: "11px" },
                  fontWeight: 700,
                  letterSpacing: { xs: "0.4px", sm: "0.8px" },
                  lineHeight: 1.5,
                }}
              >
                {marqueeText}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MovingText;