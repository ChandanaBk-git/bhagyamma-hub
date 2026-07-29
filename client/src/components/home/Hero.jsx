import { Box, Button, Container, Stack, Typography } from "@mui/material";

const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg,#E8F5E9,#F7F8FA)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} maxWidth={600}>
          <Typography
            variant="h2"
            fontWeight={700}
            color="primary"
          >
            Bhagyamma Hub
          </Typography>

          <Typography
            variant="h4"
            fontWeight={600}
          >
            Premium Herbal &
            Natural Products
          </Typography>

          <Typography color="text.secondary">
            Discover quality products that promote
            health, wellness and business opportunities
            through Bhagyamma Hub Membership.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="contained"
              size="large"
            >
              Explore Products
            </Button>

            <Button
              variant="outlined"
              size="large"
            >
              Join Membership
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;