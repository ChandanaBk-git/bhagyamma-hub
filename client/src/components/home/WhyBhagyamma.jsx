import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { whyBhagyamma } from "../../utils/dummyData";

const WhyBhagyamma = () => {
  return (
    <Box
      sx={{
        py: 10,
        background:
          "linear-gradient(to bottom,#F7F8FA,#E8F5E9)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={700}
          color="primary"
        >
          Why Bhagyamma Hub?
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 6,
          }}
        >
          More than products, we create opportunities.
        </Typography>

        <Grid container spacing={4}>
          {whyBhagyamma.map((item) => (
            <Grid
              key={item.id}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Card
                elevation={5}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  textAlign: "center",
                  p: 4,
                  transition: ".3s",

                  "&:hover": {
                    transform: "translateY(-10px)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: 55,
                    }}
                  >
                    {item.icon}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mt={2}
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

export default WhyBhagyamma;