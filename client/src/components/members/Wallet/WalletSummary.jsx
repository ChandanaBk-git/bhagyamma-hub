import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
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
      value: Number(wallet?.balance || 0),
      icon: <AccountBalanceWallet />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },
    {
      title: "Lifetime Commission",
      value: Number(wallet?.totalCommission || 0),
      icon: <Paid />,
      color: "#1565C0",
      bg: "#E3F2FD",
    },
    {
      title: "Total Withdrawn",
      value: Number(wallet?.totalWithdrawn || 0),
      icon: <TrendingDown />,
      color: "#D32F2F",
      bg: "#FFEBEE",
    },
    {
      title: "Pending Withdrawal",
      value: Number(wallet?.pendingWithdrawal || 0),
      icon: <PendingActions />,
      color: "#F9A825",
      bg: "#FFF8E1",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        overflowX: "hidden",
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1,
          sm: 1.5,
          md: 2,
        }}
        sx={{
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={card.title}
            sx={{
              minWidth: 0,
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,

                height: {
                  xs: "94px",
                  sm: "105px",
                  md: "120px",
                },

                minHeight: "0 !important",

                boxSizing: "border-box",

                borderRadius: "0 !important",

                borderLeft: {
                  xs: `3px solid ${card.color}`,
                  sm: `4px solid ${card.color}`,
                },

                borderTop: "1px solid #EEEEEE",
                borderRight: "1px solid #EEEEEE",
                borderBottom: "1px solid #EEEEEE",

                backgroundColor: "#FFFFFF",

                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.06)",

                overflow: "hidden",

                transition:
                  "box-shadow 0.2s ease",

                "&:hover": {
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.09)",
                },
              }}
            >
              <CardContent
                sx={{
                  width: "100%",
                  height: "100%",

                  minHeight: "0 !important",

                  boxSizing: "border-box",

                  padding: {
                    xs: "10px 11px !important",
                    sm: "12px 14px !important",
                    md: "15px 16px !important",
                  },

                  "&:last-child": {
                    paddingBottom: {
                      xs: "10px !important",
                      sm: "12px !important",
                      md: "15px !important",
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                  }}
                >
                  {/* ================================
                      TEXT
                  ================================= */}

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "#616161",

                        fontSize: {
                          xs: "12px",
                          sm: "13px",
                          md: "14px",
                        },

                        lineHeight: 1.2,

                        fontWeight: 400,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        marginTop: {
                          xs: "5px",
                          sm: "6px",
                          md: "7px",
                        },

                        color: "#292929",

                        fontWeight: 700,

                        fontSize: {
                          xs: "19px",
                          sm: "21px",
                          md: "24px",
                        },

                        lineHeight: 1.1,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      ₹
                      {card.value.toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>

                  {/* ================================
                      ICON
                  ================================= */}

                  <Box
                    sx={{
                      width: {
                        xs: 42,
                        sm: 50,
                        md: 58,
                      },

                      height: {
                        xs: 42,
                        sm: 50,
                        md: 58,
                      },

                      minWidth: {
                        xs: 42,
                        sm: 50,
                        md: 58,
                      },

                      borderRadius: "50%",

                      backgroundColor: card.bg,

                      color: card.color,

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      flexShrink: 0,

                      "& svg": {
                        fontSize: {
                          xs: 23,
                          sm: 27,
                          md: 32,
                        },
                      },
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
    </Box>
  );
};

export default WalletSummary;