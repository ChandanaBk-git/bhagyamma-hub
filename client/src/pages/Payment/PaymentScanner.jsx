import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  CheckCircle,
  WhatsApp,
  Payment,
  ShoppingBag,
  VerifiedRounded,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import BhagyaScanner from "../../assets/images/BhagyaScanner.png";

/*
=========================================================
WHATSAPP NUMBER
=========================================================

Actual number:
6363645068

India country code:
91

WhatsApp format:
916363645068
=========================================================
*/

const WHATSAPP_NUMBER = "916363645068";

const PaymentScanner = () => {
  const navigate = useNavigate();

  const location = useLocation();

  /*
  ========================================================
  STATE
  ========================================================
  */

  const [whatsappOpened, setWhatsappOpened] =
    useState(false);

  const [confirmed, setConfirmed] =
    useState(false);


  /*
  ========================================================
  PAYMENT DATA
  ========================================================
  */

  const state = location.state || {};

  const amount = Number(
    state.amount || 0
  );

  const orderId =
    state.orderId || null;

  const orderNumber =
    state.orderNumber || null;

  const isMember =
    state.isMember === true;


  /*
  ========================================================
  WHATSAPP MESSAGE
  ========================================================
  */

  const handleWhatsApp = () => {

    const message = [
      "Hello Bhagyamma Hub,",
      "",
      "I have completed the payment.",
      "",
      orderNumber
        ? `Order Number: ${orderNumber}`
        : "",
      orderId
        ? `Order ID: ${orderId}`
        : "",
      amount
        ? `Amount Paid: ₹${amount.toLocaleString(
            "en-IN"
          )}`
        : "",
      "",
      "I am sending the payment screenshot for verification.",
    ]
      .filter(Boolean)
      .join("\n");


    /*
    ======================================================
    WHATSAPP URL
    ======================================================
    */

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(
        message
      )}`;


    /*
    ======================================================
    OPEN WHATSAPP
    ======================================================
    */

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );


    /*
    ======================================================
    ENABLE CONFIRM BUTTON
    ======================================================
    */

    setWhatsappOpened(true);

  };


  /*
  ========================================================
  CONFIRM ORDER
  ========================================================
  */

  const handleConfirmOrder = () => {

    /*
    ------------------------------------------------------
    User must first open WhatsApp
    ------------------------------------------------------
    */

    if (!whatsappOpened) {
      return;
    }


    /*
    ------------------------------------------------------
    Mark as submitted in frontend
    ------------------------------------------------------
    */

    setConfirmed(true);


    /*
    ------------------------------------------------------
    Store payment submission locally
    ------------------------------------------------------
    
    IMPORTANT:
    This is only a frontend acknowledgement.

    It does NOT mark payment as Paid in MongoDB.
    ------------------------------------------------------
    */

    if (orderId) {

      localStorage.setItem(
        `payment_submitted_${orderId}`,
        JSON.stringify({
          orderId,
          orderNumber,
          amount,
          submittedAt:
            new Date().toISOString(),
        })
      );

    }


    /*
    ------------------------------------------------------
    Navigate to orders
    ------------------------------------------------------
    */

    navigate(
      "/orders",
      {
        state: {
          paymentSubmitted: true,
          orderId,
          orderNumber,
        },
      }
    );

  };


  /*
  ========================================================
  BACK
  ========================================================
  */

  const handleBack = () => {

    navigate(
      isMember
        ? "/member/cart"
        : "/cart"
    );

  };


  /*
  ========================================================
  INVALID PAYMENT PAGE
  ========================================================
  */

  if (!amount && !orderId) {

    return (

      <Box
        sx={{
          minHeight: "100vh",

          bgcolor: "#F5F7F5",

          py: {
            xs: 3,
            sm: 6,
          },
        }}
      >

        <Container maxWidth="sm">

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,

              border:
                "1px solid #E0E0E0",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  sm: 4,
                },

                textAlign:
                  "center",
              }}
            >

              <ShoppingBag
                sx={{
                  fontSize: 60,

                  color:
                    "#9E9E9E",

                  mb: 2,
                }}
              />

              <Typography
                variant="h5"
                fontWeight={800}
                gutterBottom
              >
                Payment Page Not Available
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 3,
                }}
              >
                Please return to your cart
                and start checkout again.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={
                  <ArrowBack />
                }
                onClick={
                  handleBack
                }
                sx={{
                  textTransform:
                    "none",

                  fontWeight:
                    700,

                  py: 1.3,
                }}
              >
                Back to Cart
              </Button>

            </CardContent>

          </Card>

        </Container>

      </Box>

    );

  }


  /*
  ========================================================
  PAYMENT PAGE
  ========================================================
  */

  return (

    <Box
      sx={{
        minHeight:
          "100vh",

        bgcolor:
          "#F5F7F5",

        py: {
          xs: 2,
          sm: 4,
          md: 6,
        },
      }}
    >

      <Container
        maxWidth="md"
      >

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Button
          startIcon={
            <ArrowBack />
          }
          onClick={
            handleBack
          }
          sx={{
            mb: 2,

            color:
              "#2E7D32",

            textTransform:
              "none",

            fontWeight:
              700,
          }}
        >
          Back to Cart
        </Button>


        {/* =================================================
            MAIN CARD
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: {
              xs: 2.5,
              sm: 4,
            },

            overflow:
              "hidden",

            border:
              "1px solid #C8E6C9",
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <Box
            sx={{
              bgcolor:
                "#2E7D32",

              color:
                "#fff",

              p: {
                xs: 2.5,
                sm: 3,
              },
            }}
          >

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >

              <Payment />

              <Box>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    fontSize: {
                      xs: "1.3rem",
                      sm: "1.7rem",
                    },
                  }}
                >
                  Scan & Pay
                </Typography>

                <Typography
                  sx={{
                    opacity:
                      0.9,

                    mt: 0.5,

                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.95rem",
                    },
                  }}
                >
                  Complete your UPI payment
                  using the QR code below.
                </Typography>

              </Box>

            </Stack>

          </Box>


          {/* =================================================
              CONTENT
          ================================================= */}

          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >

            {/* =================================================
                ORDER INFORMATION
            ================================================= */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              spacing={1.5}
              sx={{
                mb: 3,
              }}
            >

              <Box>

                {orderNumber && (

                  <>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Order Number
                    </Typography>

                    <Typography
                      fontWeight={800}
                    >
                      {orderNumber}
                    </Typography>

                  </>

                )}

              </Box>


              <Chip
                label={
                  confirmed
                    ? "Screenshot Submitted"
                    : "Payment Pending"
                }
                color={
                  confirmed
                    ? "success"
                    : "warning"
                }
                sx={{
                  fontWeight:
                    700,
                }}
              />

            </Stack>


            {/* =================================================
                INFORMATION
            ================================================= */}

            <Alert
              severity="info"
              sx={{
                mb: 3,

                borderRadius:
                  2,
              }}
            >
              Scan the QR code using
              PhonePe, Google Pay, Paytm,
              BHIM or another UPI app.
            </Alert>


            {/* =================================================
                AMOUNT
            ================================================= */}

            <Box
              sx={{
                textAlign:
                  "center",

                mb: 3,
              }}
            >

              <Typography
                color="text.secondary"
                fontWeight={600}
              >
                Amount to Pay
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "2.3rem",
                    sm: "3rem",
                  },

                  fontWeight:
                    900,

                  color:
                    "#2E7D32",
                }}
              >
                ₹
                {amount.toLocaleString(
                  "en-IN"
                )}
              </Typography>

            </Box>


            {/* =================================================
                BHAGYA SCANNER
            ================================================= */}

            <Box
              sx={{
                display:
                  "flex",

                justifyContent:
                  "center",

                width:
                  "100%",
              }}
            >

              <Box
                sx={{
                  width: {
                    xs: 280,
                    sm: 360,
                  },

                  maxWidth:
                    "100%",

                  bgcolor:
                    "#fff",

                  p: {
                    xs: 1,
                    sm: 1.5,
                  },

                  borderRadius:
                    3,

                  border:
                    "2px solid #E0E0E0",

                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.08)",
                }}
              >

                <img
                  src={
                    BhagyaScanner
                  }
                  alt="Bhagyamma Hub PhonePe Payment QR"
                  style={{
                    width:
                      "100%",

                    height:
                      "auto",

                    display:
                      "block",
                  }}
                />

              </Box>

            </Box>


            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{
                mt: 2,

                fontSize:
                  "0.85rem",
              }}
            >
              Scan the QR code using
              your UPI application and
              complete the payment.
            </Typography>


            <Divider
              sx={{
                my: 3,
              }}
            />


            {/* =================================================
                STEP INSTRUCTIONS
            ================================================= */}

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                mb: 2,
              }}
            >
              After completing payment
            </Typography>


            <Stack spacing={1.5}>

              {/* STEP 1 */}

              <Box
                sx={{
                  display:
                    "flex",

                  gap:
                    1.5,

                  alignItems:
                    "flex-start",
                }}
              >

                <CheckCircle
                  sx={{
                    color:
                      "#2E7D32",

                    flexShrink:
                      0,
                  }}
                />

                <Typography>
                  Pay the exact amount shown
                  above.
                </Typography>

              </Box>


              {/* STEP 2 */}

              <Box
                sx={{
                  display:
                    "flex",

                  gap:
                    1.5,

                  alignItems:
                    "flex-start",
                }}
              >

                <CheckCircle
                  sx={{
                    color:
                      "#2E7D32",

                    flexShrink:
                      0,
                  }}
                />

                <Typography>
                  Take a screenshot after
                  the payment is successful.
                </Typography>

              </Box>


              {/* STEP 3 */}

              <Box
                sx={{
                  display:
                    "flex",

                  gap:
                    1.5,

                  alignItems:
                    "flex-start",
                }}
              >

                <CheckCircle
                  sx={{
                    color:
                      "#2E7D32",

                    flexShrink:
                      0,
                  }}
                />

                <Typography>
                  Send the payment screenshot
                  to Bhagyamma Hub on
                  WhatsApp.
                </Typography>

              </Box>

            </Stack>


            {/* =================================================
                WHATSAPP NUMBER CARD
            ================================================= */}

            <Box
              sx={{
                mt: 3,

                p: 2,

                bgcolor:
                  "#E8F5E9",

                border:
                  "1px solid #A5D6A7",

                borderRadius:
                  2,
              }}
            >

              <Typography
                textAlign="center"
                fontWeight={800}
                color="#1B5E20"
              >
                Send Screenshot To
              </Typography>

              <Typography
                textAlign="center"
                fontWeight={900}
                sx={{
                  fontSize:
                    "1.15rem",

                  mt: 0.5,

                  letterSpacing:
                    0.5,
                }}
              >
                +91 6363645068
              </Typography>

            </Box>


            {/* =================================================
                WHATSAPP BUTTON
            ================================================= */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                <WhatsApp />
              }
              onClick={
                handleWhatsApp
              }
              sx={{
                mt: 2,

                py: 1.5,

                borderRadius:
                  2.5,

                bgcolor:
                  "#25D366",

                color:
                  "#fff",

                "&:hover": {
                  bgcolor:
                    "#1DA851",
                },

                textTransform:
                  "none",

                fontWeight:
                  800,

                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
              }}
            >
              Send Payment Screenshot
              on WhatsApp
            </Button>


            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{
                mt: 1,

                fontSize:
                  "0.8rem",
              }}
            >
              WhatsApp will open with
              your order details already
              filled in.
            </Typography>


            {/* =================================================
                CONFIRMATION BOX
            ================================================= */}

            <Box
              sx={{
                mt: 3,

                p: {
                  xs: 2,
                  sm: 2.5,
                },

                borderRadius:
                  3,

                bgcolor:
                  "#F1F8E9",

                border:
                  "1px solid #C5E1A5",
              }}
            >

              <Typography
                fontWeight={800}
                sx={{
                  mb: 0.8,

                  color:
                    "#33691E",
                }}
              >
                Have you sent the screenshot?
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight:
                    1.6,

                  mb: 2,
                }}
              >
                First send the payment
                screenshot to
                <strong>
                  {" "}+91 6363645068
                </strong>
                {" "}through WhatsApp.
                Then confirm your order
                below.
              </Typography>


              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={
                  <VerifiedRounded />
                }
                disabled={
                  !whatsappOpened
                }
                onClick={
                  handleConfirmOrder
                }
                sx={{
                  py: 1.4,

                  borderRadius:
                    2.2,

                  textTransform:
                    "none",

                  fontWeight:
                    800,

                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.95rem",
                  },
                }}
              >
                {whatsappOpened
                  ? "I've Sent the Screenshot — Confirm Order"
                  : "Send Screenshot on WhatsApp First"}
              </Button>


              {!whatsappOpened && (

                <Typography
                  textAlign="center"
                  color="text.secondary"
                  sx={{
                    mt: 1,

                    fontSize:
                      "0.75rem",
                  }}
                >
                  The confirmation button
                  becomes available after
                  opening WhatsApp.
                </Typography>

              )}

            </Box>


            {/* =================================================
                PAYMENT VERIFICATION WARNING
            ================================================= */}

            <Alert
              severity="warning"
              sx={{
                mt: 3,

                borderRadius:
                  2,
              }}
            >
              Your payment is not automatically
              verified. Bhagyamma Hub will
              manually verify the screenshot
              before marking the payment as
              completed.
            </Alert>


            {/* =================================================
                FINAL NOTE
            ================================================= */}

            <Typography
              textAlign="center"
              variant="caption"
              color="text.secondary"
              sx={{
                display:
                  "block",

                mt: 2,

                lineHeight:
                  1.5,
              }}
            >
              Please keep your payment
              screenshot until your order
              has been verified.
            </Typography>

          </CardContent>

        </Card>

      </Container>

    </Box>

  );
};

export default PaymentScanner;