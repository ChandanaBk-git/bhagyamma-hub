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

const CommissionSummary = ({ commissions = [] }) => {

  const today = new Date();

  let todayCommission = 0;
  let monthlyCommission = 0;
  let lifetimeCommission = 0;

  commissions.forEach((item) => {

    lifetimeCommission += item.commissionAmount;

    const commissionDate = new Date(item.createdAt);

    if (
      commissionDate.toDateString() ===
      today.toDateString()
    ) {
      todayCommission += item.commissionAmount;
    }

    if (
      commissionDate.getMonth() === today.getMonth() &&
      commissionDate.getFullYear() === today.getFullYear()
    ) {
      monthlyCommission += item.commissionAmount;
    }

  });

  const cards = [
  {
    title: "Today's Commission",
    subtitle: "Updated Today",
    value: todayCommission,
    icon: <Today sx={{ fontSize: 38 }} />,
    color: "#2E7D32",
    bg: "#E8F5E9",
  },
  {
    title: "Monthly Commission",
    subtitle: "Current Month",
    value: monthlyCommission,
    icon: <CalendarMonth sx={{ fontSize: 38 }} />,
    color: "#1565C0",
    bg: "#E3F2FD",
  },
  {
    title: "Lifetime Commission",
    subtitle: "Total Earnings",
    value: lifetimeCommission,
    icon: <CurrencyRupee sx={{ fontSize: 38 }} />,
    color: "#EF6C00",
    bg: "#FFF3E0",
  },
  {
    title: "Transactions",
    subtitle: "All Records",
    value: commissions.length,
    icon: <ReceiptLong sx={{ fontSize: 38 }} />,
    color: "#6A1B9A",
    bg: "#F3E5F5",
    isMoney: false,
  },
];
  return (

    <Grid container spacing={3} mb={3}>

      {

        cards.map((card)=>(

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
    height: "100%",
    borderRadius: 4,
    borderLeft: `5px solid ${card.color}`,
    transition: ".3s",
    "&:hover": {
      transform: "translateY(-6px)",
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
  {card.isMoney === false
    ? card.value
    : `₹${Number(card.value).toLocaleString("en-IN")}`}
</Typography>

<Typography
  variant="caption"
  color="text.secondary"
>
  {card.subtitle}
</Typography>

                  </Box>

<Box
  sx={{
    bgcolor: card.bg,
    color: card.color,
    width: 68,
    height: 68,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

export default CommissionSummary;