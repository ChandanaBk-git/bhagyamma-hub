import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaidIcon from "@mui/icons-material/Paid";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";

const DashboardStats = ({ data }) => {
  const summary = data?.summary || {};

  const stats = [
    {
      title: "Wallet Balance",
      value: `₹${summary.walletBalance || 0}`,
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      color: "#2E7D32",
    },
    {
      title: "Total Commission",
      value: `₹${summary.totalCommission || 0}`,
      icon: <PaidIcon fontSize="large" />,
      color: "#1565C0",
    },
    {
      title: "Selling Points",
      value: summary.sellingPoints || 0,
      icon: <EmojiEventsIcon fontSize="large" />,
      color: "#EF6C00",
    },
    {
      title: "Total Referrals",
      value: summary.totalReferrals || 0,
      icon: <GroupIcon fontSize="large" />,
      color: "#6A1B9A",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.title}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              height: "100%",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mt={1}
                  >
                    {item.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;