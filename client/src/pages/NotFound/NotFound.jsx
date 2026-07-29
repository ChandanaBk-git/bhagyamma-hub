import { Container, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2">
        404 - Page Not Found
      </Typography>
    </Container>
  );
};

export default NotFound;