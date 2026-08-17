import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const SummaryCard = ({ summary = {} }) => {
  const {
    sellingPoints = 0,
    lifetimePurchase = 0,
    isSupervisor = false,
    supervisorTarget = 500,
    remainingTarget = 0,
  } = summary;

  const cards = [
    {
      title: "Selling Points",
      value: sellingPoints,
      icon: <StarIcon />,
      iconColor: "#2E7D32",
      iconBg: "#E8F5E9",
    },
    {
      title: "Lifetime Purchase",
      value: `₹${Number(lifetimePurchase).toLocaleString("en-IN")}`,
      icon: <ShoppingCartIcon />,
      iconColor: "#1976D2",
      iconBg: "#EAF2FF",
    },
    {
      title: "Remaining Target",
      value: remainingTarget,
      icon: <TrendingUpIcon />,
      iconColor: "#EF6C00",
      iconBg: "#FFF3E8",
    },
    {
      title: "Supervisor",
      value: isSupervisor ? "YES" : "NO",
      icon: <EmojiEventsIcon />,
      iconColor: "#7B1FA2",
      iconBg: "#F5E8FA",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
      }}
    >
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2,
          md: 2.5,
        }}
      >
        {cards.map((card) => (
          <Grid
            key={card.title}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                minHeight: {
                  xs: 145,
                  sm: 155,
                  md: 165,
                },

                height: "100%",

                boxSizing: "border-box",

                p: {
                  xs: 2,
                  sm: 2.25,
                  md: 2.5,
                },

                borderRadius: {
                  xs: "24px",
                  sm: "26px",
                  md: "28px",
                },

                backgroundColor: "#FFFFFF",

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.08)",

                overflow: "hidden",

                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                  transform: {
                    xs: "none",
                    sm: "translateY(-3px)",
                  },

                  boxShadow:
                    "0 10px 28px rgba(0,0,0,0.12)",
                },
              }}
            >
              {/* ICON */}
              <Box
                sx={{
                  width: {
                    xs: 48,
                    sm: 52,
                  },

                  height: {
                    xs: 48,
                    sm: 52,
                  },

                  borderRadius: "50%",

                  backgroundColor: card.iconBg,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  flexShrink: 0,

                  "& svg": {
                    fontSize: {
                      xs: 29,
                      sm: 31,
                    },

                    color: card.iconColor,
                  },
                }}
              >
                {card.icon}
              </Box>

              {/* TITLE */}
              <Typography
                sx={{
                  mt: 1.5,

                  fontSize: {
                    xs: "0.9rem",
                    sm: "0.95rem",
                    md: "1rem",
                  },

                  lineHeight: 1.3,

                  color: "#616161",

                  fontWeight: 400,

                  whiteSpace: "normal",

                  wordBreak: "break-word",
                }}
              >
                {card.title}
              </Typography>

              {/* VALUE */}
              <Typography
                sx={{
                  mt: 0.5,

                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.35rem",
                    md: "1.45rem",
                  },

                  lineHeight: 1.2,

                  color: "#292929",

                  fontWeight: 700,

                  wordBreak: "break-word",
                }}
              >
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SummaryCard;