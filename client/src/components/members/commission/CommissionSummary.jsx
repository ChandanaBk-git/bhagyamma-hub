import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import {
  Today,
  CalendarMonth,
  CurrencyRupee,
  ReceiptLong,
} from "@mui/icons-material";

const CommissionSummary = ({
  commissions = [],
}) => {
  const today = new Date();

  let todayCommission = 0;
  let monthlyCommission = 0;
  let lifetimeCommission = 0;

  // =====================================================
  // CALCULATE COMMISSIONS
  // =====================================================

  commissions.forEach((item) => {
    const amount = Number(
      item?.commissionAmount || 0
    );

    lifetimeCommission += amount;

    const commissionDate = new Date(
      item?.createdAt
    );

    if (
      commissionDate.toDateString() ===
      today.toDateString()
    ) {
      todayCommission += amount;
    }

    if (
      commissionDate.getMonth() ===
        today.getMonth() &&
      commissionDate.getFullYear() ===
        today.getFullYear()
    ) {
      monthlyCommission += amount;
    }
  });

  // =====================================================
  // CARDS
  // =====================================================

  const cards = [
    {
      title: "Today's Commission",
      subtitle: "Updated Today",
      value: todayCommission,
      icon: <Today />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },

    {
      title: "Monthly Commission",
      subtitle: "Current Month",
      value: monthlyCommission,
      icon: <CalendarMonth />,
      color: "#1565C0",
      bg: "#E3F2FD",
    },

    {
      title: "Lifetime Commission",
      subtitle: "Total Earnings",
      value: lifetimeCommission,
      icon: <CurrencyRupee />,
      color: "#EF6C00",
      bg: "#FFF3E0",
    },

    {
      title: "Transactions",
      subtitle: "All Records",
      value: commissions.length,
      icon: <ReceiptLong />,
      color: "#6A1B9A",
      bg: "#F3E5F5",
      isMoney: false,
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 2,
        md: 2.5,
      }}
      sx={{
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        mb: {
          xs: 0,
          sm: 0,
          md: 0,
        },
      }}
    >
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: "100%",
              minWidth: 0,

              minHeight: {
                xs: 135,
                sm: 150,
                md: 160,
              },

              height: "100%",

              boxSizing: "border-box",

              borderRadius: {
                xs: "24px",
                sm: "26px",
                md: "28px",
              },

              borderLeft: {
                xs: `4px solid ${card.color}`,
                sm: `5px solid ${card.color}`,
              },

              backgroundColor: "#FFFFFF",

              boxShadow:
                "0 6px 20px rgba(0,0,0,0.08)",

              overflow: "hidden",

              transition:
                "transform 0.2s ease, box-shadow 0.2s ease",

              "&:hover": {
                transform: {
                  xs: "none",
                  sm: "translateY(-4px)",
                },

                boxShadow:
                  "0 10px 28px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                boxSizing: "border-box",

                p: {
                  xs: 2,
                  sm: 2.25,
                  md: 2.5,
                },

                "&:last-child": {
                  pb: {
                    xs: 2,
                    sm: 2.25,
                    md: 2.5,
                  },
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.5}
                sx={{
                  height: "100%",
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#616161",

                      fontSize: {
                        xs: "0.9rem",
                        sm: "0.95rem",
                        md: "1rem",
                      },

                      lineHeight: 1.3,

                      whiteSpace: "normal",

                      wordBreak: "break-word",
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.75,

                      color: "#292929",

                      fontWeight: 700,

                      fontSize: {
                        xs: "1.25rem",
                        sm: "1.4rem",
                        md: "1.5rem",
                      },

                      lineHeight: 1.2,

                      wordBreak: "break-word",
                    }}
                  >
                    {card.isMoney === false
                      ? card.value
                      : `₹${Number(
                          card.value || 0
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,

                      color: "#757575",

                      fontSize: {
                        xs: "0.72rem",
                        sm: "0.78rem",
                        md: "0.82rem",
                      },

                      lineHeight: 1.3,
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: 54,
                      sm: 62,
                      md: 68,
                    },

                    height: {
                      xs: 54,
                      sm: 62,
                      md: 68,
                    },

                    minWidth: {
                      xs: 54,
                      sm: 62,
                      md: 68,
                    },

                    borderRadius: "50%",

                    bgcolor: card.bg,

                    color: card.color,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 30,
                        sm: 34,
                        md: 38,
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
  );
};

export default CommissionSummary;