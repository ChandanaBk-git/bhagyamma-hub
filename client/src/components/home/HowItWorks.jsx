import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { howItWorks } from "../../utils/dummyData";

const HowItWorks = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
          gutterBottom
        >
          How It Works
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Start your journey with Bhagyamma Hub in four simple steps.
        </Typography>

        <Grid container spacing={4}>
          {howItWorks.map((item) => (
            <Grid
              key={item.id}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  textAlign: "center",
                  p: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h2"
                    color="secondary"
                    fontWeight={700}
                  >
                    {item.step}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mt: 2 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    {item.description}
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

export default HowItWorks;