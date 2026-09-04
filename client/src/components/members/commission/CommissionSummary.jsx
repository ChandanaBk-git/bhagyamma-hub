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


  /* =====================================================
     CALCULATE COMMISSIONS
  ===================================================== */

  commissions.forEach((item) => {

    const amount = Number(
      item?.commissionAmount || 0
    );

    lifetimeCommission += amount;

    const commissionDate =
      new Date(item?.createdAt);


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


  /* =====================================================
     CARDS
  ===================================================== */

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


  /* =====================================================
     UI
  ===================================================== */

  return (

    <Grid
      container
      spacing={{
        xs: 0.75,
        sm: 1,
        md: 1.5,
      }}
      sx={{
        width: "100%",
        maxWidth: "100%",

        margin: 0,

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

      {cards.map((card) => (

        <Grid
          key={card.title}
          size={{
            xs: 6,
            sm: 6,
            md: 3,
          }}
        >

          <Card
            elevation={0}
            sx={{
              width: "100%",

              minWidth: 0,

              height: {
                xs: "78px",
                sm: "88px",
                md: "100px",
              },

              minHeight: 0,

              boxSizing: "border-box",

              borderRadius: 0,

              borderLeft: {
                xs: `2px solid ${card.color}`,
                sm: `3px solid ${card.color}`,
              },

              borderTop: "1px solid #E5E5E5",
              borderRight: "1px solid #E5E5E5",
              borderBottom: "1px solid #E5E5E5",

              backgroundColor: "#FFFFFF",

              boxShadow: "none",

              overflow: "hidden",

              transition: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >

            <CardContent
              sx={{
                width: "100%",

                height: "100%",

                minHeight: 0,

                padding: {
                  xs: "7px 8px !important",
                  sm: "9px 10px !important",
                  md: "11px 12px !important",
                },

                boxSizing: "border-box",

                "&:last-child": {
                  paddingBottom: {
                    xs: "7px !important",
                    sm: "9px !important",
                    md: "11px !important",
                  },
                },
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0.5}
                sx={{
                  width: "100%",

                  height: "100%",

                  minWidth: 0,
                }}
              >

                {/* ======================================
                    TEXT
                ====================================== */}

                <Box
                  sx={{
                    minWidth: 0,

                    flex: 1,

                    overflow: "hidden",
                  }}
                >

                  {/* TITLE */}

                  <Typography
                    sx={{
                      color: "#616161",

                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                        md: "11px",
                      },

                      lineHeight: 1.15,

                      fontWeight: 500,

                      whiteSpace: "nowrap",

                      overflow: "hidden",

                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.title}
                  </Typography>


                  {/* VALUE */}

                  <Typography
                    sx={{
                      marginTop: {
                        xs: "3px",
                        sm: "4px",
                        md: "5px",
                      },

                      color: "#292929",

                      fontWeight: 700,

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

                    {card.isMoney === false
                      ? card.value
                      : `₹${Number(
                          card.value || 0
                        ).toLocaleString(
                          "en-IN"
                        )}`}

                  </Typography>


                  {/* SUBTITLE */}

                  <Typography
                    sx={{
                      marginTop: {
                        xs: "2px",
                        sm: "3px",
                        md: "4px",
                      },

                      color: "#888888",

                      fontSize: {
                        xs: "8px",
                        sm: "9px",
                        md: "10px",
                      },

                      lineHeight: 1.1,

                      whiteSpace: "nowrap",

                      overflow: "hidden",

                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.subtitle}
                  </Typography>

                </Box>


                {/* ======================================
                    ICON
                ====================================== */}

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

                    bgcolor: card.bg,

                    color: card.color,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 16,
                        sm: 19,
                        md: 22,
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