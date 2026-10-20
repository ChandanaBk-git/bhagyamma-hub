
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
      label: "Product Information",
      path: "/policies/product-information-pricing",
    },
    {
      label: "Direct Selling Disclosure",
      path: "/policies/direct-selling-disclosures",
    },
  ];

  const headingStyles = {
    color: "#FFFFFF",
    fontSize: "0.82rem",
    fontWeight: 700,
    mb: 1,
    letterSpacing: "0.2px",
  };

  const linkStyles = {
    color: "rgba(255,255,255,0.84)",
    fontSize: "0.73rem",
    lineHeight: 1.65,
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
    fontSize: "0.72rem",
    lineHeight: 1.65,
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
        maxWidth: "100%",
        boxSizing: "border-box",
        bgcolor: "#174D20",
        color: "#FFFFFF",
        mt: 0,
        pt: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 1, sm: 1.5, md: 2 },
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          boxSizing: "border-box",
          px: { xs: 1.75, sm: 3, md: 3 },
        }}
      >
        <Grid
          container
          columnSpacing={{ xs: 1.5, sm: 3, md: 4 }}
          rowSpacing={{ xs: 2, sm: 3, md: 3 }}
          alignItems="flex-start"
        >
          {/* BRAND - ORIGINAL NAME PRESERVED */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
 
{/* BRAND NAMES - SAME SIZE */}
<Typography
  sx={{
    fontSize: "0.98rem",
    fontWeight: 800,
    letterSpacing: "0.3px",
    lineHeight: 1.5,
    mb: 0.35,
  }}
>
  Hucharaddi
</Typography>

<Typography
  sx={{
    fontSize: "0.98rem",
    fontWeight: 800,
    letterSpacing: "0.3px",
    lineHeight: 1.5,
    color: "#D4E8C8",
    mb: 0.65,
  }}
>
  Bhagya S
</Typography>


            <Typography
              sx={{
                fontSize: "0.72rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 280,
              }}
            >
              Your trusted destination for quality products
              and smart business opportunities.
            </Typography>

            {/* SOCIAL LINKS */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Link
                href="#"
                color="inherit"
                aria-label="Facebook"
                sx={{ display: "flex" }}
              >
                <Facebook sx={{ fontSize: 18 }} />
              </Link>

              <Link
                href="#"
                color="inherit"
                aria-label="Instagram"
                sx={{ display: "flex" }}
              >
                <Instagram sx={{ fontSize: 18 }} />
              </Link>

              <Link
                href="#"
                color="inherit"
                aria-label="YouTube"
                sx={{ display: "flex" }}
              >
                <YouTube sx={{ fontSize: 18 }} />
              </Link>
            </Box>
          </Grid>

          {/* QUICK LINKS */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography sx={headingStyles}>
              Quick Links
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.25,
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

          {/* COLLAPSIBLE POLICIES */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.5,
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  ...headingStyles,
                  mb: 0,
                }}
              >
                Policies
              </Typography>

              <Box
                component="button"
                type="button"
                aria-controls="footer-policy-links"
                aria-label={
                  policiesOpen
                    ? "Collapse policies"
                    : "Expand policies"
                }
                aria-expanded={policiesOpen}
                onClick={() =>
                  setPoliciesOpen((open) => !open)
                }
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 26,
                  minHeight: 26,
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
                  xs: policiesOpen ? "flex" : "none",
                  md: "flex",
                },
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.2,
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={headingStyles}>
              Contact Us
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.8,
                mb: 0.6,
                minWidth: 0,
              }}
            >
              <Email sx={iconStyle} />

              <Typography sx={contactText}>
                bhagyammahub@gmail.com
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.8,
                mb: 0.6,
                minWidth: 0,
              }}
            >
              <Phone sx={iconStyle} />

              <Typography sx={contactText}>
                +91 90191 74672
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.8,
                minWidth: 0,
              }}
            >
              <LocationOn sx={iconStyle} />

              <Typography sx={contactText}>
                <Box
                  component="span"
                  sx={{ color: "#FFFFFF", fontWeight: 700 }}
                >
                  Business Address:{" "}
                </Box>
                Ward No. 22, Near Veeranjaneya Temple,
                Gadag Betageri, Gadag District,
                Karnataka - 582101, India.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: { xs: 1.5, sm: 2.5, md: 3 },
            borderColor: "rgba(255,255,255,0.18)",
          }}
        />

        {/* ORIGINAL COPYRIGHT NAME PRESERVED */}
        <Typography
          align="center"
          sx={{
            fontSize: "0.67rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            px: 1,
          }}
        >
          © {new Date().getFullYear()} Hucharaddi.
          All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
