import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import {
  ShoppingBag,
  PendingActions,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";


const OrdersSummary = ({ orders = [] }) => {

  const total = orders.length;

  const pending = orders.filter(
    (o) =>
      o.status === "PENDING" ||
      o.status === "PLACED"
  ).length;

  const delivered = orders.filter(
    (o) =>
      o.status === "DELIVERED"
  ).length;

  const cancelled = orders.filter(
    (o) =>
      o.status === "CANCELLED"
  ).length;


  const cards = [
    {
      title: "Total Orders",
      value: total,
      icon: <ShoppingBag />,
      color: "#1565C0",
      bg: "#E3F2FD",
    },

    {
      title: "Pending",
      value: pending,
      icon: <PendingActions />,
      color: "#F9A825",
      bg: "#FFF8E1",
    },

    {
      title: "Delivered",
      value: delivered,
      icon: <CheckCircle />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },

    {
      title: "Cancelled",
      value: cancelled,
      icon: <Cancel />,
      color: "#D32F2F",
      bg: "#FFEBEE",
    },
  ];


  return (
    <Grid
      container
      spacing={{
        xs: 0.75,
        sm: 1,
        md: 1.5,
      }}
      mb={{
        xs: 1,
        sm: 1.5,
      }}
    >

      {cards.map((card) => (

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          key={card.title}
        >

          <Card
            elevation={0}
            sx={{
              width: "100%",
              height: "100%",

              borderRadius: 0,

              border:
                "1px solid #E0E0E0",

              borderLeft:
                `3px solid ${card.color}`,

              boxShadow: "none",

              boxSizing: "border-box",

              transition:
                "border-color 0.2s ease",

              "&:hover": {
                borderColor:
                  card.color,
              },
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 1,
                  sm: 1.25,
                  md: 1.5,
                },

                "&:last-child": {
                  pb: {
                    xs: 1,
                    sm: 1.25,
                    md: 1.5,
                  },
                },
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                        md: "11px",
                      },

                      lineHeight: 1.3,

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {card.title}
                  </Typography>


                  <Typography
                    sx={{
                      mt: {
                        xs: 0.3,
                        sm: 0.4,
                      },

                      fontSize: {
                        xs: "20px",
                        sm: "23px",
                        md: "26px",
                      },

                      lineHeight: 1.1,

                      fontWeight: 800,

                      color: "#292929",
                    }}
                  >
                    {card.value}
                  </Typography>

                </Box>


                <Box
                  sx={{
                    width: {
                      xs: 30,
                      sm: 34,
                      md: 38,
                    },

                    height: {
                      xs: 30,
                      sm: 34,
                      md: 38,
                    },

                    flexShrink: 0,

                    bgcolor:
                      card.bg,

                    color:
                      card.color,

                    borderRadius: 0,

                    display: "flex",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",
                  }}
                >
                  {card.icon}
                </Box>

              </Stack>

            </CardContent>

          </Card>

        </Grid>

      ))}

    </Grid>
  );
};


export default OrdersSummary;