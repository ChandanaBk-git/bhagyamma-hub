import React from "react";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";

import {
  QrCode2,
  WhatsApp,
  ArrowBack,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import BhagyaScanner from "../../assets/images/BhagyaScanner.png";

// =====================================================
// MEMBERSHIP PAYMENT SCANNER
//
// ONLY FOR ₹2,000 REGISTRATION / MEMBERSHIP PAYMENT
//
// Two entry points:
//
// 1. Register
//    /register
//       ↓
//    /membership-payment
//       ↓
//    Back → /register
//
// 2. Member Dashboard
//    /member/dashboard
//       ↓
//    /membership-payment
//       ↓
//    Back → /member/dashboard
// =====================================================

const MembershipPaymentScanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // DETERMINE WHERE SCANNER WAS OPENED FROM
  // =====================================================

  const openedFrom =
    location.state?.from;

  // =====================================================
  // WHATSAPP NUMBER
  // =====================================================

  const whatsappNumber =
    "916363645068";

  // =====================================================
  // WHATSAPP MESSAGE
  // =====================================================

  const whatsappMessage =
    encodeURIComponent(
      `Hello Bhagyamma Hub,

I have completed my ₹2,000 registration payment.

I am sending the payment screenshot for verification.

Please verify my registration payment.`
    );

  // =====================================================
  // WHATSAPP URL
  // =====================================================

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // =====================================================
  // OPEN WHATSAPP
  // =====================================================

  const handleWhatsApp = () => {
    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    // ---------------------------------------------------
    // IF OPENED FROM CREATE ACCOUNT
    // ---------------------------------------------------

    if (openedFrom === "register") {
      navigate(
        "/register",
        {
          replace: true,
          state: {
            restoreRegistration: true,
          },
        }
      );

      return;
    }

    // ---------------------------------------------------
    // IF OPENED FROM MEMBER DASHBOARD
    // ---------------------------------------------------

    if (
      openedFrom === "member-dashboard"
    ) {
      navigate(
        "/member/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // FALLBACK
    //
    // If somebody directly opens:
    // /membership-payment
    //
    // Don't send them to registration.
    // Send them to member dashboard.
    // ---------------------------------------------------

    navigate(
      "/member/dashboard",
      {
        replace: true,
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F5F7F6",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        px: {
          xs: 1.5,
          sm: 2,
        },

        py: {
          xs: 2,
          sm: 4,
        },
      }}
    >

      <Container
        maxWidth="sm"
        sx={{
          px: {
            xs: 0,
            sm: 2,
          },
        }}
      >

        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,

            overflow: "hidden",

            bgcolor: "#FFFFFF",
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <Box
            sx={{
              position: "relative",

              bgcolor: "#2E7D32",

              color: "#FFFFFF",

              textAlign: "center",

              px: {
                xs: 2,
                sm: 3,
              },

              pt: {
                xs: 3,
                sm: 3.5,
              },

              pb: {
                xs: 3,
                sm: 3.5,
              },
            }}
          >

            {/* BACK */}

            <Button
              startIcon={
                <ArrowBack
                  sx={{
                    fontSize:
                      "19px !important",
                  }}
                />
              }
              onClick={handleBack}
              sx={{
                position: "absolute",

                top: {
                  xs: 12,
                  sm: 16,
                },

                left: {
                  xs: 10,
                  sm: 16,
                },

                color: "#FFFFFF",

                textTransform: "none",

                fontWeight: 700,

                minWidth: "auto",

                px: {
                  xs: 1,
                  sm: 1.5,
                },

                borderRadius: 2,

                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,0.12)",
                },
              }}
            >
              Back
            </Button>

            {/* ICON */}

            <QrCode2
              sx={{
                fontSize: {
                  xs: 38,
                  sm: 44,
                },

                mb: 0.5,

                mt: {
                  xs: 1,
                  sm: 0,
                },
              }}
            />

            {/* TITLE */}

            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "1.35rem",
                  sm: "1.5rem",
                },
              }}
            >
              Registration Payment
            </Typography>

            {/* SUBTITLE */}

            <Typography
              sx={{
                mt: 0.5,

                opacity: 0.9,

                fontSize: {
                  xs: 13,
                  sm: 14,
                },
              }}
            >
              Bhagyamma Hub Membership
            </Typography>

          </Box>

          {/* =================================================
              CONTENT
          ================================================= */}

          <Box
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
              },

              textAlign: "center",
            }}
          >

            {/* FEE */}

            <Typography
              color="text.secondary"
              fontSize={14}
            >
              Registration Fee
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: {
                  xs: 38,
                  sm: 46,
                },

                fontWeight: 900,

                color: "#2E7D32",

                lineHeight: 1.2,
              }}
            >
              ₹2,000
            </Typography>

            {/* QR CODE */}

            <Box
              sx={{
                mt: 3,

                display: "flex",

                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 230,
                    sm: 280,
                  },

                  p: 1.5,

                  bgcolor: "#FFFFFF",

                  border:
                    "1px solid #E0E0E0",

                  borderRadius: 3,

                  boxShadow:
                    "0 6px 20px rgba(0,0,0,0.08)",
                }}
              >
                <Box
                  component="img"
                  src={BhagyaScanner}
                  alt="Bhagyamma Hub registration payment QR code"
                  sx={{
                    width: "100%",

                    height: "auto",

                    display: "block",

                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>

            {/* INSTRUCTION */}

            <Typography
              sx={{
                mt: 2,

                fontWeight: 800,

                fontSize: {
                  xs: 15,
                  sm: 16,
                },
              }}
            >
              Scan and pay ₹2,000
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.7,

                lineHeight: 1.6,

                px: {
                  xs: 0,
                  sm: 2,
                },
              }}
            >
              Scan this QR code using
              PhonePe, Google Pay, Paytm
              or any UPI application.
            </Typography>

            {/* PAYMENT PROOF */}

            <Box
              sx={{
                mt: 3,

                p: {
                  xs: 2,
                  sm: 2.5,
                },

                bgcolor: "#F1F8F2",

                border:
                  "1px solid #D7EAD8",

                borderRadius: 3,
              }}
            >
              <Typography
                fontWeight={800}
                color="#2E7D32"
              >
                Payment completed?
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,

                  lineHeight: 1.6,
                }}
              >
                Take a screenshot of the
                successful payment and send
                it to Bhagyamma Hub on
                WhatsApp for verification.
              </Typography>
            </Box>

            {/* WHATSAPP */}

            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsApp />}
              onClick={handleWhatsApp}
              sx={{
                mt: 3,

                py: 1.5,

                borderRadius: 3,

                bgcolor: "#25D366",

                color: "#FFFFFF",

                fontWeight: 800,

                textTransform: "none",

                fontSize: {
                  xs: 14,
                  sm: 15,
                },

                "&:hover": {
                  bgcolor: "#1EBE5D",
                },
              }}
            >
              Send Payment Screenshot on WhatsApp
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",

                mt: 1,
              }}
            >
              WhatsApp: +91 6363645068
            </Typography>

            {/* BOTTOM BACK */}

            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{
                mt: 2,

                textTransform: "none",

                color: "#2E7D32",

                fontWeight: 700,
              }}
            >
              {openedFrom === "register"
                ? "Back to Registration"
                : "Back to Dashboard"}
            </Button>

          </Box>

        </Paper>

      </Container>

    </Box>
  );
};

export default MembershipPaymentScanner;