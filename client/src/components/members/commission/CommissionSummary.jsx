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
        xs: 1,
        sm: 1.5,
        md: 2,
      }}
      sx={{
        width: "100%",
        maxWidth: "100%",

        margin: 0,

        boxSizing: "border-box",

        "& > .MuiGrid-item": {
          paddingTop: {
            xs: "4px",
            sm: "6px",
            md: "8px",
          },

          paddingLeft: {
            xs: "4px",
            sm: "6px",
            md: "8px",
          },
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

              height: {
                xs: "94px",
                sm: "110px",
                md: "125px",
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

                padding: {
                  xs: "10px 11px !important",
                  sm: "13px 14px !important",
                  md: "16px !important",
                },

                boxSizing: "border-box",

                "&:last-child": {
                  paddingBottom: {
                    xs: "10px !important",
                    sm: "13px !important",
                    md: "16px !important",
                  },
                },
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
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


                  {/* VALUE */}

                  <Typography
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
                        xs: "4px",
                        sm: "5px",
                        md: "6px",
                      },

                      color: "#757575",

                      fontSize: {
                        xs: "10px",
                        sm: "11px",
                        md: "12px",
                      },

                      lineHeight: 1.2,

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

                    bgcolor: card.bg,

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

  );

};


export default CommissionSummary;