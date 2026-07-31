import { Box, Container, Typography } from "@mui/material";

const ProductBanner = () => {
  return (
    <Box
      sx={{
        py: 8,
        background: "linear-gradient(135deg,#E8F5E9,#F1F8E9)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          fontWeight={700}
          color="primary"
        >
          Our Products
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Explore premium herbal and wellness products carefully selected
          for your healthy lifestyle.
        </Typography>
      </Container>
    </Box>
  );
};

export default ProductBanner;