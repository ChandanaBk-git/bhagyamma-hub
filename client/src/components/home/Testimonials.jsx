import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";

import { testimonials } from "../../utils/dummyData";

const Testimonials = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#F7F8FA" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
          gutterBottom
        >
          What Our Members Say
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Trusted by our growing Bhagyamma Hub family.
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((item) => (
            <Grid
              key={item.id}
              size={{ xs: 12, md: 4 }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  p: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent>
                  <Avatar
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 70,
                      height: 70,
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.location}
                  </Typography>

                  <Rating
                    value={item.rating}
                    readOnly
                    sx={{ mb: 2 }}
                  />

                  <Typography color="text.secondary">
                    "{item.review}"
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

export default Testimonials;