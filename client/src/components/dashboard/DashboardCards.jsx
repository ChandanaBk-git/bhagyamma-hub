import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const DashboardCards = ({ data }) => {
  const cards = [
    {
      title: "Total Members",
      value: data?.totalMembers || 0,
      icon: <PeopleIcon fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Total Products",
      value: data?.totalProducts || 0,
      icon: <Inventory2Icon fontSize="large" />,
      color: "#2e7d32",
    },
    {
      title: "Total Layers",
      value: data?.totalLayers || 0,
      icon: <AccountTreeIcon fontSize="large" />,
      color: "#f9a825",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 4 }}
        >
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
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
                    color="text.secondary"
                    variant="subtitle2"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mt={1}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: card.color,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;