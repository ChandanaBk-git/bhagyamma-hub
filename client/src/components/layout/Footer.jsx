
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
    {
      label: "Terms & Conditions",
      path: "/policies/terms-and-conditions",
    },
    {
      label: "Privacy Policy",
      path: "/policies/privacy-policy",
    },
    {
      label: "Shipping & Delivery",
      path: "/policies/shipping-delivery",
    },
    {
      label: "Returns & Refunds",
      path: "/policies/cancellation-returns-refunds",
    },
    {
      label: "Membership & Commission",
      path: "/policies/membership-referral-commission",
    },
    {
      label: "SP & Rewards",
      path: "/policies/sp-supervisor-rewards",
    },
    {
      label: "Wallet & Withdrawal",
      path: "/policies/wallet-withdrawal",
    },
    {
      label: "Account & Conduct",
      path: "/policies/account-conduct-supervisor",
    },
    {
      label: "Customer Support",
      path: "/policies/grievance-customer-support",
    },
    {
      label: "Product Information",
      path: "/policies/product-information-pricing",
    },
    {
      label: "Direct Selling Disclosure",
      path: "/policies/direct-selling-disclosures",
    },
  ];

  const linkStyles = {
    fontSize: {
      xs: "0.62rem",
      sm: "0.72rem",
    },
    lineHeight: 1.6,
    color: "inherit",
    textDecorationColor: "rgba(255,255,255,0.4)",
    width: "fit-content",
    "&:hover": {
      color: "#D4E8C8",
      textDecorationColor: "#D4E8C8",
    },
  };

  const headingStyles = {
    fontSize: {
      xs: "0.78rem",
      sm: "0.9rem",
    },
    mb: 0.8,
    color: "#FFFFFF",
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1B5E20",
        color: "#fff",
        mt: 0,
        pt: {
          xs: 2.5,
          sm: 3.5,
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
            xs: 2,
            sm: 2.5,
          }}
        >
          {/* Company */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
                mb: 0.4,
              }}
            >
              Hucharaddi
            </Typography>

            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
                mb: 0.7,
              }}
            >
              Bhagya S
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.75rem",
                },
                lineHeight: 1.6,
                opacity: 0.9,
                maxWidth: 350,
              }}
            >
              Your trusted destination for quality products and smart business
              opportunities.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography fontWeight={700} sx={headingStyles}>
              Quick Links
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.45,
              }}
            >
              {quickLinks.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  underline="hover"
                  sx={linkStyles}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Policies */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography fontWeight={700} sx={headingStyles}>
              Policies
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.45,
              }}
            >
              {policyLinks.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  underline="hover"
                  sx={linkStyles}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography fontWeight={700} sx={headingStyles}>
              Contact Us
            </Typography>

            <Box display="flex" alignItems="center" mb={0.7}>
              <Person sx={{ mr: 0.7, fontSize: 15 }} />

              <Typography sx={{ fontSize: "0.68rem" }}>
                <strong>Prop:</strong> Hucharaddi
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={0.7}>
              <Person sx={{ mr: 0.7, fontSize: 15 }} />

              <Typography sx={{ fontSize: "0.68rem" }}>
                <strong>Prop:</strong> Bhagya S
              </Typography>
            </Box>

            <Box display="flex" alignItems="flex-start" mb={0.7}>
              <Email sx={{ mr: 0.7, fontSize: 15, mt: 0.1 }} />

              <Typography
                sx={{
                  fontSize: "0.68rem",
                  wordBreak: "break-word",
                }}
              >
                bhagyammahub@gmail.com
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={0.7}>
              <Phone sx={{ mr: 0.7, fontSize: 15 }} />

              <Typography sx={{ fontSize: "0.68rem" }}>
                +91 90191 74672
              </Typography>
            </Box>

            <Box display="flex" alignItems="flex-start" mb={1}>
              <LocationOn sx={{ mr: 0.7, fontSize: 15, mt: 0.1 }} />

              <Typography sx={{ fontSize: "0.68rem" }}>
                Gadag, Karnataka - 582101
              </Typography>
            </Box>

            {/* Social Media */}
            <Box display="flex" gap={1}>
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
        </Grid>

        <Divider
          sx={{
            my: {
              xs: 1.5,
              sm: 2,
            },
            borderColor: "rgba(255,255,255,0.18)",
          }}
        />

        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "0.58rem",
              sm: "0.68rem",
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
