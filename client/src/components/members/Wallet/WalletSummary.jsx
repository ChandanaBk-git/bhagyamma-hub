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
          xs: 2,
          sm: 2.5,
          md: 3,
        },
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1.5,
          sm: 2,
          md: 2.5,
        }}
        sx={{
          width: "100%",
          margin: 0,
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
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",

                borderRadius: {
                  xs: 3,
                  sm: 3.5,
                  md: 4,
                },

                borderLeft: `4px solid ${card.color}`,

                backgroundColor: "#FFFFFF",

                boxShadow:
                  "0 5px 18px rgba(0, 0, 0, 0.07)",

                overflow: "hidden",

                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                  transform: {
                    xs: "none",
                    sm: "translateY(-3px)",
                  },

                  boxShadow:
                    "0 8px 24px rgba(0, 0, 0, 0.10)",
                },
              }}
            >
              <CardContent
                sx={{
                  width: "100%",
                  boxSizing: "border-box",

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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={{
                    xs: 1.5,
                    sm: 2,
                  }}
                  sx={{
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {/* ============================
                      TEXT
                  ============================ */}

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      component="div"
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.9rem",
                          md: "0.95rem",
                        },

                        lineHeight: 1.35,

                        whiteSpace: "normal",

                        overflowWrap: "break-word",

                        wordBreak: "break-word",
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      component="div"
                      fontWeight={700}
                      sx={{
                        mt: 0.75,

                        fontSize: {
                          xs: "1.25rem",
                          sm: "1.4rem",
                          md: "1.6rem",
                        },

                        lineHeight: 1.2,

                        color: "#2B2B2B",

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

                  {/* ============================
                      ICON
                  ============================ */}

                  <Box
                    sx={{
                      flexShrink: 0,

                      width: {
                        xs: 54,
                        sm: 60,
                        md: 66,
                      },

                      height: {
                        xs: 54,
                        sm: 60,
                        md: 66,
                      },

                      borderRadius: "50%",

                      backgroundColor: card.bg,

                      color: card.color,

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      "& svg": {
                        fontSize: {
                          xs: 28,
                          sm: 32,
                          md: 36,
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