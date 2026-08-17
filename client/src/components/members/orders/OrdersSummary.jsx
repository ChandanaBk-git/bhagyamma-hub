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
      icon: <ShoppingBag sx={{ fontSize: 38 }} />,
      color: "#1565C0",
      bg: "#E3F2FD",
    },

    {
      title: "Pending",
      value: pending,
      icon: <PendingActions sx={{ fontSize: 38 }} />,
      color: "#F9A825",
      bg: "#FFF8E1",
    },

    {
      title: "Delivered",
      value: delivered,
      icon: <CheckCircle sx={{ fontSize: 38 }} />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },

    {
      title: "Cancelled",
      value: cancelled,
      icon: <Cancel sx={{ fontSize: 38 }} />,
      color: "#D32F2F",
      bg: "#FFEBEE",
    },

  ];

  return (

    <Grid
      container
      spacing={3}
      mb={3}
    >

      {

        cards.map((card) => (

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
                borderRadius: 4,
                borderLeft: `5px solid ${card.color}`,
                transition: ".3s",

                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >

              <CardContent>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Box>

                    <Typography
                      color="text.secondary"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      mt={1}
                    >
                      {card.value}
                    </Typography>

                  </Box>

                  <Box
                    sx={{
                      width: 65,
                      height: 65,
                      bgcolor: card.bg,
                      color: card.color,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {card.icon}
                  </Box>

                </Stack>

              </CardContent>

            </Card>

          </Grid>

        ))

      }

    </Grid>

  );

};

export default OrdersSummary;