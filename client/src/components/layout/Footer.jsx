import { useState } from "react";

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
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const [policiesOpen, setPoliciesOpen] = useState(false);

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
      label: "Account & Conduct",
      path: "/policies/account-conduct-supervisor",
    },
    {
      label: "Customer Support",
      path: "/policies/grievance-customer-support",
    },
    {
      label: "Product Info & Pricing",
      path: "/policies/product-information-pricing",
    },
    {
      label: "Direct Selling Disclosure",
      path: "/policies/direct-selling-disclosures",
    },
  ];

  const headingStyles = {
    color: "#FFFFFF",
    fontSize: "0.78rem",
    fontWeight: 700,
    mb: 0.6,
    letterSpacing: "0.2px",
    textTransform: "uppercase",
  };

  const linkStyles = {
    color: "rgba(255,255,255,0.82)",
    fontSize: "0.72rem",
    lineHeight: 1.5,
    width: "fit-content",
    maxWidth: "100%",
    textDecoration: "none",
    overflowWrap: "anywhere",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#D4E8C8",
      textDecoration: "underline",
    },
    "&:focus-visible": {
      outline: "2px solid #D4E8C8",
      outlineOffset: "2px",
    },
  };

  const contactText = {
    fontSize: "0.71rem",
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.85)",
    overflowWrap: "anywhere",
  };

  const iconStyle = {
    fontSize: 14,
    color: "#D4E8C8",
    flexShrink: 0,
    mt: "2px",
  };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        bgcolor: "#174D20",
        color: "#FFFFFF",
        mt: 0,
        pt: { xs: 1.75, sm: 2.25 },
        pb: { xs: 1.25, sm: 1.5 },
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          boxSizing: "border-box",
          px: { xs: 1.75, sm: 3 },
        }}
      >
        <Grid
          container
          columnSpacing={{ xs: 1.5, sm: 2.5, md: 3 }}
          rowSpacing={{ xs: 1.5, sm: 2 }}
          alignItems="flex-start"
        >
          {/* BRAND */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontWeight: 800,
                letterSpacing: "0.2px",
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              Hucharaddi{" "}
              <Box component="span" sx={{ color: "#D4E8C8" }}>
                Bhagya S
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: "0.71rem",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 260,
              }}
            >
              Your trusted destination for quality products and smart business
              opportunities.
            </Typography>
          </Grid>

          {/* QUICK LINKS */}
          <Grid size={{ xs: 5, sm: 3, md: 1.75 }}>
            <Typography sx={headingStyles}>Quick Links</Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.15,
              }}
            >
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

          {/* COLLAPSIBLE / 2-COLUMN POLICIES */}
          <Grid size={{ xs: 7, sm: 3, md: 3.75 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.5,
                mb: 0.6,
              }}
            >
              <Typography sx={{ ...headingStyles, mb: 0 }}>
                Policies
              </Typography>

              <Box
                component="button"
                type="button"
                aria-controls="footer-policy-links"
                aria-label={
                  policiesOpen ? "Collapse policies" : "Expand policies"
                }
                aria-expanded={policiesOpen}
                onClick={() => setPoliciesOpen((open) => !open)}
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 22,
                  minHeight: 22,
                  p: 0,
                  border: 0,
                  borderRadius: 1,
                  color: "#D4E8C8",
                  background: "transparent",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {policiesOpen ? (
                  <KeyboardArrowUp fontSize="small" />
                ) : (
                  <KeyboardArrowDown fontSize="small" />
                )}
              </Box>
            </Box>

            <Box
              id="footer-policy-links"
              sx={{
                display: {
                  xs: policiesOpen ? "grid" : "none",
                  md: "grid",
                },
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                columnGap: 1.5,
                rowGap: 0.15,
              }}
            >
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

          {/* CONTACT DETAILS */}
          <Grid size={{ xs: 12, sm: 12, md: 3.5 }}>
            <Typography sx={headingStyles}>Contact Us</Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 1.5,
                rowGap: 0.4,
                mb: 0.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Email sx={iconStyle} />
                <Typography sx={contactText}>
                  bhagyammahub@gmail.com
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Phone sx={iconStyle} />
                <Typography sx={contactText}>+91 90191 74672</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.6,
                minWidth: 0,
              }}
            >
              <LocationOn sx={iconStyle} />

              <Typography sx={contactText}>
                Ward No. 22, Near Veeranjaneya Temple, Gadag Betageri, Gadag
                Dist., Karnataka - 582101, India.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 1.25,
            borderColor: "rgba(255,255,255,0.16)",
          }}
        />

        {/* COMPACT BOTTOM BAR: COPYRIGHT + SOCIALS */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0.75,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.68rem",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.75)",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            © {new Date().getFullYear()} Hucharaddi. All Rights Reserved.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Link
              href="#"
              color="inherit"
              aria-label="Facebook"
              sx={{
                display: "flex",
                color: "rgba(255,255,255,0.8)",
                "&:hover": { color: "#D4E8C8" },
              }}
            >
              <Facebook sx={{ fontSize: 16 }} />
            </Link>

            <Link
              href="#"
              color="inherit"
              aria-label="Instagram"
              sx={{
                display: "flex",
                color: "rgba(255,255,255,0.8)",
                "&:hover": { color: "#D4E8C8" },
              }}
            >
              <Instagram sx={{ fontSize: 16 }} />
            </Link>

            <Link
              href="#"
              color="inherit"
              aria-label="YouTube"
              sx={{
                display: "flex",
                color: "rgba(255,255,255,0.8)",
                "&:hover": { color: "#D4E8C8" },
              }}
            >
              <YouTube sx={{ fontSize: 16 }} />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;