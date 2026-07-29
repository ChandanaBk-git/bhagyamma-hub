import { Box, Container, Grid, Typography, Paper } from "@mui/material";

const Intro = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              Welcome to Bhagyamma Hub
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 2 }}
            >
              Bhagyamma Hub is dedicated to bringing premium herbal,
              wellness, and lifestyle products to every family. Our
              mission is to provide high-quality products while creating
              opportunities for individuals to grow through our trusted
              membership network.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 3, lineHeight: 2 }}
            >
              We believe in quality, trust, customer satisfaction, and
              empowering people to build a better future together.
            </Typography>
          </Grid>

          {/* Right Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={4}
              sx={{
                p: 5,
                borderRadius: 4,
                bgcolor: "#F7F8FA",
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Our Vision
              </Typography>

              <Typography color="text.secondary">
                To become India's most trusted platform for premium
                herbal products and membership-driven business
                opportunities.
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mt: 4 }}
                gutterBottom
              >
                Our Mission
              </Typography>

              <Typography color="text.secondary">
                Deliver quality products, create opportunities, and
                build a strong community through innovation, trust, and
                customer satisfaction.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Intro;