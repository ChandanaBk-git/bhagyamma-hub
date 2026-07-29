import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "#2E7D32",
        color: "#fff",
        mt: 8,
        py: 3,
      }}
    >
      <Container>
        <Typography align="center">
          © {new Date().getFullYear()} Bhagyamma Hub. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;