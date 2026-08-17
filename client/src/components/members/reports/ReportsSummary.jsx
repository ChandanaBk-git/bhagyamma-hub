import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import {
  AccountBalanceWallet,
  ShoppingBag,
  Groups,
  Stars,
} from "@mui/icons-material";

const ReportsSummary = ({
  summary = {},
  wallet = {},
}) => {

  const cards = [

    {
      title: "Wallet Balance",
      value: `₹${wallet.balance || 0}`,
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },

    {
      title: "Selling Points",
      value: summary.totalSellingPoints || 0,
      icon: <Stars sx={{ fontSize: 40 }} />,
      color: "#F57C00",
      bg: "#FFF3E0",
    },

    {
      title: "Network Members",
      value:
        summary.totalNetworkMembers ||
        summary.totalMembers ||
        0,
      icon: <Groups sx={{ fontSize: 40 }} />,
      color: "#1565C0",
      bg: "#E3F2FD",
    },

    {
      title: "Orders",
      value:
        summary.totalOrders || 0,
      icon: <ShoppingBag sx={{ fontSize: 40 }} />,
      color: "#8E24AA",
      bg: "#F3E5F5",
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
                borderRadius:4,
                transition:".3s",

                "&:hover":{
                  transform:"translateY(-5px)",
                  boxShadow:8,
                }
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
                      width:65,
                      height:65,
                      bgcolor:card.bg,
                      color:card.color,
                      borderRadius:"50%",
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center",
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

export default ReportsSummary;