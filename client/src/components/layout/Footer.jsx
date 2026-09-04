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
        bgcolor: "#1B5E20",
        color: "#fff",
        mt: 0,
        pt: {
          xs: 2,
          sm: 3,
        },
        pb: 1.2,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
        }}
      >
        <Grid
          container
          spacing={{
            xs: 1.5,
            sm: 2.5,
          }}
        >
          {/* Company */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                },
                mb: 0.4,
              }}
            >
              Hucharaddi
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "0.58rem",
                  sm: "0.68rem",
                },
                lineHeight: 1.45,
                opacity: 0.9,
                maxWidth: 350,
              }}
            >
              Your trusted destination for quality products and smart business
              opportunities.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.82rem",
                },
                mb: 0.6,
              }}
            >
              Quick Links
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.15,
              }}
            >
              <Link
                href="/"
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.6rem" }}
              >
                Home
              </Link>

              <Link
                href="/products"
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.6rem" }}
              >
                Products
              </Link>

              <Link
                href="/about"
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.6rem" }}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.6rem" }}
              >
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.82rem",
                },
                mb: 0.6,
              }}
            >
              Contact Us
            </Typography>

            <Box display="flex" alignItems="center" mb={0.35}>
              <Person sx={{ mr: 0.5, fontSize: 14 }} />

              <Typography sx={{ fontSize: "0.58rem" }}>
                <strong>Prop:</strong> Hucharaddi
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={0.35}>
              <Email sx={{ mr: 0.5, fontSize: 14 }} />

              <Typography
                sx={{
                  fontSize: "0.58rem",
                  wordBreak: "break-word",
                }}
              >
                bhagyammahub@gmail.com
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={0.35}>
              <Phone sx={{ mr: 0.5, fontSize: 14 }} />

              <Typography sx={{ fontSize: "0.58rem" }}>
                +91 90191 74672
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={0.7}>
              <LocationOn sx={{ mr: 0.5, fontSize: 14 }} />

              <Typography sx={{ fontSize: "0.58rem" }}>
                Gadag, Karnataka - 582101
              </Typography>
            </Box>

            <Box display="flex" gap={0.8}>
              <Link href="#" color="inherit">
                <Facebook sx={{ fontSize: 16 }} />
              </Link>

              <Link href="#" color="inherit">
                <Instagram sx={{ fontSize: 16 }} />
              </Link>

              <Link href="#" color="inherit">
                <YouTube sx={{ fontSize: 16 }} />
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: {
              xs: 1.2,
              sm: 1.8,
            },
            borderColor: "rgba(255,255,255,0.18)",
          }}
        />

        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "0.52rem",
              sm: "0.62rem",
            },
            opacity: 0.85,
          }}
        >
          © {new Date().getFullYear()}{" "}
          <strong>Hucharaddi</strong>. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;