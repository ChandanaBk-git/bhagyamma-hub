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
  Facebook,
  Instagram,
  YouTube,
  LocationOn,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const policyLinks = [
    { label: "All Policies", path: "/policies" },
    { label: "Terms & Conditions", path: "/policies/terms-and-conditions" },
    { label: "Privacy Policy", path: "/policies/privacy-policy" },
    { label: "Shipping & Delivery", path: "/policies/shipping-delivery" },
    { label: "Returns & Refunds", path: "/policies/cancellation-returns-refunds" },
    { label: "Account & Conduct", path: "/policies/account-conduct-supervisor" },
    { label: "Customer Support", path: "/policies/grievance-customer-support" },
    { label: "Product Information", path: "/policies/product-information-pricing" },
    { label: "Direct Selling Disclosure", path: "/policies/direct-selling-disclosures" },
  ];

  const headingStyles = {
    color: "#FFFFFF",
    fontSize: "0.82rem",
    fontWeight: 700,
    mb: 1.1,
    letterSpacing: "0.2px",
  };

  const linkStyles = {
    color: "rgba(255,255,255,0.82)",
    fontSize: "0.72rem",
    lineHeight: 1.65,
    width: "fit-content",
    textDecoration: "none",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#D4E8C8",
      textDecoration: "underline",
    },
  };

  const contactText = {
    fontSize: "0.72rem",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.85)",
    overflowWrap: "anywhere",
  };

  const iconStyle = {
    fontSize: 16,
    color: "#D4E8C8",
    flexShrink: 0,
    mt: "2px",
  };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "#174D20",
        color: "#FFFFFF",
        mt: 0,
        pt: { xs: 2.5, md: 3.5 },
        pb: { xs: 1.2, md: 1.5 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 3 },
        }}
      >
        <Grid
          container
          columnSpacing={{ xs: 2, md: 4 }}
          rowSpacing={{ xs: 2.5, md: 2 }}
          alignItems="flex-start"
        >
          {/* Brand */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "0.3px",
                mb: 0.25,
              }}
            >
              Hucharaddi
            </Typography>

            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#D4E8C8",
                mb: 0.8,
              }}
            >
              Bhagya S
            </Typography>

            <Typography
              sx={{
                fontSize: "0.72rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 260,
              }}
            >
              Your trusted destination for quality products and smart
              business opportunities.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, mt: 1.4 }}>
              <Link href="#" color="inherit" aria-label="Facebook">
                <Facebook sx={{ fontSize: 19 }} />
              </Link>
              <Link href="#" color="inherit" aria-label="Instagram">
                <Instagram sx={{ fontSize: 19 }} />
              </Link>
              <Link href="#" color="inherit" aria-label="YouTube">
                <YouTube sx={{ fontSize: 19 }} />
              </Link>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography sx={headingStyles}>Quick Links</Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.45 }}>
              {quickLinks.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={linkStyles}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Policies */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Typography sx={headingStyles}>Policies</Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
              {policyLinks.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={linkStyles}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Details */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={headingStyles}>Contact Us</Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 0.8 }}>
              <Email sx={iconStyle} />
              <Typography sx={contactText}>
                bhagyammahub@gmail.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 0.8 }}>
              <Phone sx={iconStyle} />
              <Typography sx={contactText}>+91 90191 74672</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <LocationOn sx={iconStyle} />
              <Typography sx={contactText}>
                Gadag, Karnataka - 582101, India
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: { xs: 1.8, md: 2.2 },
            borderColor: "rgba(255,255,255,0.18)",
          }}
        />

        <Typography
          align="center"
          sx={{
            fontSize: "0.68rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          © {new Date().getFullYear()} Hucharaddi. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;