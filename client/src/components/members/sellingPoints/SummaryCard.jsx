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

const SummaryCard = ({
  summary = {},
}) => {
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
      value: `₹${Number(
        lifetimePurchase
      ).toLocaleString("en-IN")}`,
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
      value: isSupervisor
        ? "YES"
        : "NO",
      icon: <EmojiEventsIcon />,
      iconColor: "#7B1FA2",
      iconBg: "#F5E8FA",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mb: 1.5,
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1,
          sm: 1.5,
        }}
      >
        {cards.map((card) => (
          <Grid
            key={card.title}
            item
            xs={6}
            sm={6}
            md={3}
          >
            <Paper
              elevation={0}
              sx={{
                width: "100%",

                minHeight: {
                  xs: 78,
                  sm: 90,
                },

                height: "100%",

                boxSizing:
                  "border-box",

                p: {
                  xs: 1,
                  sm: 1.25,
                },

                borderRadius: 0,

                border:
                  `1px solid ${card.iconColor}`,

                borderLeft:
                  `3px solid ${card.iconColor}`,

                backgroundColor:
                  "#FFFFFF",

                display: "flex",

                alignItems:
                  "center",

                gap: {
                  xs: 0.8,
                  sm: 1,
                },

                boxShadow: "none",

                overflow: "hidden",

                transition:
                  "border-color 0.2s ease",

                "&:hover": {
                  transform:
                    "none",

                  boxShadow:
                    "none",

                  borderColor:
                    card.iconColor,
                },
              }}
            >
              {/* =================================================
                  ICON
              ================================================= */}

              <Box
                sx={{
                  width: {
                    xs: 30,
                    sm: 36,
                  },

                  height: {
                    xs: 30,
                    sm: 36,
                  },

                  minWidth: {
                    xs: 30,
                    sm: 36,
                  },

                  borderRadius: 0,

                  backgroundColor:
                    card.iconBg,

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink: 0,

                  "& svg": {
                    fontSize: {
                      xs: 17,
                      sm: 21,
                    },

                    color:
                      card.iconColor,
                  },
                }}
              >
                {card.icon}
              </Box>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {/* TITLE */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "10px",
                    },

                    lineHeight: 1.2,

                    color:
                      "#616161",

                    fontWeight: 500,

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {card.title}
                </Typography>

                {/* VALUE */}

                <Typography
                  sx={{
                    mt: 0.35,

                    fontSize: {
                      xs: "14px",
                      sm: "17px",
                    },

                    lineHeight: 1.15,

                    color:
                      "#292929",

                    fontWeight: 700,

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SummaryCard;