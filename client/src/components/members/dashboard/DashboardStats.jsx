import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

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
      icon: <AccountBalanceWalletIcon />,
      color: "#2E7D32",
    },
    {
      title: "Total Commission",
      value: `₹${summary.totalCommission || 0}`,
      icon: <PaidIcon />,
      color: "#1565C0",
    },
    {
      title: "Selling Points",
      value: summary.sellingPoints || 0,
      icon: <EmojiEventsIcon />,
      color: "#EF6C00",
    },
    {
      title: "Total Referrals",
      value: summary.totalReferrals || 0,
      icon: <GroupIcon />,
      color: "#6A1B9A",
    },
  ];

  return (
    <Grid
      container
      columns={{ xs: 12, sm: 12, md: 12 }}
      spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
      sx={{
        width: "100%",
        margin: 0,
        mb: { xs: 2, sm: 3 },
      }}
    >
      {stats.map((item) => (
        <Grid
          key={item.title}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <Card
            elevation={2}
            sx={{
              width: "100%",
              height: "100%",
              minWidth: 0,
              borderRadius: {
                xs: 2.5,
                sm: 3,
              },
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 1.75,
                  sm: 2,
                  md: 2.5,
                },
                "&:last-child": {
                  pb: {
                    xs: 1.75,
                    sm: 2,
                    md: 2.5,
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.8rem",
                      },
                      lineHeight: 1.3,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    fontWeight={800}
                    sx={{
                      mt: 0.75,
                      fontSize: {
                        xs: "1.35rem",
                        sm: "1.5rem",
                        md: "1.75rem",
                      },
                      lineHeight: 1.2,
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: 48,
                      sm: 52,
                      md: 56,
                    },
                    height: {
                      xs: 48,
                      sm: 52,
                      md: 56,
                    },
                    minWidth: {
                      xs: 48,
                      sm: 52,
                      md: 56,
                    },
                    borderRadius: "50%",
                    bgcolor: item.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 25,
                        sm: 28,
                        md: 30,
                      },
                    },
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