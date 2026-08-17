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
  Paid,
  TrendingDown,
  PendingActions,
} from "@mui/icons-material";

const WalletSummary = ({ wallet = {} }) => {

  const cards = [

    {
      title: "Wallet Balance",
      value: wallet.balance || 0,
      icon: <AccountBalanceWallet sx={{ fontSize: 38 }} />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },

    {
      title: "Lifetime Commission",
      value: wallet.totalCommission || 0,
      icon: <Paid sx={{ fontSize: 38 }} />,
      color: "#1565C0",
      bg: "#E3F2FD",
    },

    {
      title: "Total Withdrawn",
      value: wallet.totalWithdrawn || 0,
      icon: <TrendingDown sx={{ fontSize: 38 }} />,
      color: "#D32F2F",
      bg: "#FFEBEE",
    },

    {
      title: "Pending Withdrawal",
      value: wallet.pendingWithdrawal || 0,
      icon: <PendingActions sx={{ fontSize: 38 }} />,
      color: "#F9A825",
      bg: "#FFF8E1",
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
                      ₹
                      {Number(card.value).toLocaleString("en-IN")}
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

export default WalletSummary;