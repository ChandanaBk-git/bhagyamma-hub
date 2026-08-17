import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  Stars,
  ShoppingCart,
  EmojiEvents,
  TrendingUp,
} from "@mui/icons-material";

const SummaryCard = ({ summary = {} }) => {
  const sellingPoints =
    Number(summary?.sellingPoints || 0);

  const lifetimePurchase =
    Number(summary?.lifetimePurchase || 0);

  const remainingTarget =
    Number(
      summary?.remainingTarget ??
        Math.max(500 - sellingPoints, 0)
    );

  const isSupervisor =
    Boolean(summary?.isSupervisor);

  const cards = [
    {
      title: "Selling Points",
      value: sellingPoints,
      icon: <Stars fontSize="large" />,
      color: "#2E7D32",
    },

    {
      title: "Lifetime Purchase",
      value: `₹${lifetimePurchase.toLocaleString(
        "en-IN"
      )}`,
      icon: <ShoppingCart fontSize="large" />,
      color: "#1565C0",
    },

    {
      title: "Remaining Target",
      value: remainingTarget,
      icon: <TrendingUp fontSize="large" />,
      color: "#EF6C00",
    },

    {
      title: "Supervisor",
      value: isSupervisor ? "YES" : "NO",
      icon: <EmojiEvents fontSize="large" />,
      color: "#8E24AA",
    },
  ];

  return (
    <Grid
      container
      spacing={3}
      mb={3}
    >
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={card.title}
        >
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: `${card.color}18`,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                {card.icon}
              </Box>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: "0.95rem",
                }}
              >
                {card.title}
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  mt: 0.5,
                }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCard;