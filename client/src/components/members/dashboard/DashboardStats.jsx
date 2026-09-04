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
      spacing={{
        xs: 0.75,
        sm: 1,
        md: 1.5,
      }}
      sx={{
        width: "100%",

        margin: 0,

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        boxSizing: "border-box",

        "& > .MuiGrid-item": {
          paddingTop: {
            xs: "3px",
            sm: "4px",
            md: "6px",
          },

          paddingLeft: {
            xs: "3px",
            sm: "4px",
            md: "6px",
          },
        },
      }}
    >

      {stats.map((item) => (

        <Grid
          key={item.title}
          size={{
            xs: 6,
            sm: 6,
            md: 3,
          }}
          sx={{
            minWidth: 0,
          }}
        >

          <Card
            elevation={0}
            sx={{
              width: "100%",

              height: {
                xs: "72px",
                sm: "82px",
                md: "94px",
              },

              minWidth: 0,

              minHeight: 0,

              borderRadius: 0,

              border: "1px solid #E0E0E0",

              borderLeft: {
                xs: `2px solid ${item.color}`,
                sm: `3px solid ${item.color}`,
              },

              backgroundColor: "#FFFFFF",

              overflow: "hidden",

              boxSizing: "border-box",

              boxShadow: "none",
            }}
          >

            <CardContent
              sx={{
                width: "100%",

                height: "100%",

                minHeight: 0,

                boxSizing: "border-box",

                p: {
                  xs: "7px 8px",
                  sm: "9px 10px",
                  md: "11px 12px",
                },

                "&:last-child": {
                  pb: {
                    xs: "7px",
                    sm: "9px",
                    md: "11px",
                  },
                },
              }}
            >

              <Box
                sx={{
                  width: "100%",

                  height: "100%",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: {
                    xs: 0.5,
                    sm: 0.75,
                  },

                  minWidth: 0,
                }}
              >

                {/* =====================================
                    TEXT
                ===================================== */}

                <Box
                  sx={{
                    flex: 1,

                    minWidth: 0,

                    overflow: "hidden",
                  }}
                >

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                        md: "11px",
                      },

                      fontWeight: 500,

                      lineHeight: 1.15,

                      whiteSpace: "nowrap",

                      overflow: "hidden",

                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </Typography>


                  <Typography
                    fontWeight={700}
                    sx={{
                      mt: {
                        xs: "3px",
                        sm: "4px",
                        md: "5px",
                      },

                      fontSize: {
                        xs: "15px",
                        sm: "17px",
                        md: "20px",
                      },

                      lineHeight: 1.05,

                      whiteSpace: "nowrap",

                      overflow: "hidden",

                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.value}
                  </Typography>

                </Box>


                {/* =====================================
                    ICON
                ===================================== */}

                <Box
                  sx={{
                    width: {
                      xs: 28,
                      sm: 34,
                      md: 40,
                    },

                    height: {
                      xs: 28,
                      sm: 34,
                      md: 40,
                    },

                    minWidth: {
                      xs: 28,
                      sm: 34,
                      md: 40,
                    },

                    borderRadius: 0,

                    bgcolor: item.color,

                    color: "#fff",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 15,
                        sm: 18,
                        md: 21,
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