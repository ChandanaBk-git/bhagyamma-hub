import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
} from "@mui/material";
import {
  Email,
  Phone,
  Person,
  Facebook,
  Instagram,
  YouTube,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#2E7D32",
        color: "#fff",
        mt: 8,
        pt: 5,
        pb: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Hucharaddi
            </Typography>

            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              Your trusted destination for quality products and smart business
              opportunities. We are committed to providing excellent service
              and empowering our customers.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>

            <Typography>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
            </Typography>

            <Typography>
              <Link href="/products" color="inherit" underline="hover">
                Products
              </Link>
            </Typography>

            <Typography>
              <Link href="/about" color="inherit" underline="hover">
                About Us
              </Link>
            </Typography>

            <Typography>
              <Link href="/contact" color="inherit" underline="hover">
                Contact Us
              </Link>
            </Typography>
          </Grid>

          {/* Contact Details */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>

            <Box display="flex" alignItems="center" mb={1}>
              <Person sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                <strong>Prop :</strong> Hucharaddi
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                bhagyammahub@gmail.com
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Phone sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                +91 90191 74672
              </Typography>
            </Box>

            <Box display="flex" alignItems="flex-start" mb={2}>
              <LocationOn sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                Gadag, Karnataka - 582101
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>

              <Link href="#" color="inherit">
                <Instagram />
              </Link>

              <Link href="#" color="inherit">
                <YouTube />
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.3)" }} />

        <Typography
          variant="body2"
          align="center"
          sx={{ opacity: 0.9 }}
        >
          © {new Date().getFullYear()} <strong>Hucharaddi</strong>. All Rights
          Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;