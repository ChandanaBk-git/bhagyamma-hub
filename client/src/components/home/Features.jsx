import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { features } from "../../utils/dummyData";

const Features = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
          gutterBottom
        >
          Why Customers Choose Us
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          We are committed to quality, trust, and customer satisfaction.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid
              key={feature.id}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  textAlign: "center",
                  p: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: 50,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;