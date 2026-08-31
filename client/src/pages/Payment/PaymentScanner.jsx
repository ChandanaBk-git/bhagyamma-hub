import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  CheckCircle,
  InfoOutlined,
  Payment,
  WhatsApp,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../../api";

import { useCart } from "../../context/CartContext";

import BhagyaScanner from "../../assets/images/BhagyaScanner.png";


/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};


const getOrderDataFromResponse = (response) => {
  if (!response) {
    return null;
  }

  if (response?.data?.data) {
    return response.data.data;
  }

  if (response?.data) {
    return response.data;
  }

  return null;
};


/* =========================================================
   COMPONENT
========================================================= */

const PaymentScanner = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const params = useParams();


  /* =======================================================
     CART CONTEXT

     IMPORTANT:
     clearAll() clears the backend cart AND updates
     React CartContext state.

     This fixes the old-cart-items problem.
  ======================================================= */

  const {
    clearAll,
  } = useCart();


  /* =======================================================
     ORDER STATE
  ======================================================= */

  const [order, setOrder] = useState(
    location?.state?.order || null
  );

  const [loading, setLoading] = useState(
    !location?.state?.order
  );

  const [error, setError] = useState("");

  const [clearingCart, setClearingCart] =
    useState(false);

  const [paymentCompleted, setPaymentCompleted] =
    useState(false);


  /* =======================================================
     ORDER ID
  ======================================================= */

  const orderId =
    params?.id ||
    params?.orderId ||
    location?.state?.orderId ||
    location?.state?.id ||
    location?.state?.order?._id ||
    null;


  const orderNumber =
    order?.orderNumber ||
    location?.state?.orderNumber ||
    "";


  /* =======================================================
     LOAD ORDER
  ======================================================= */

  useEffect(() => {
    let mounted = true;


    const loadOrder = async () => {

      /* ---------------------------------------------------
         ORDER ALREADY PASSED FROM CHECKOUT
      --------------------------------------------------- */

      if (location?.state?.order) {

        if (mounted) {

          setOrder(
            location.state.order
          );

          setLoading(false);
        }

        return;
      }


      /* ---------------------------------------------------
         ORDER ID MISSING
      --------------------------------------------------- */

      if (!orderId) {

        if (mounted) {

          setError(
            "Order information is missing. Please return to your orders and try again."
          );

          setLoading(false);
        }

        return;
      }


      /* ---------------------------------------------------
         FETCH ORDER
      --------------------------------------------------- */

      try {

        setLoading(true);

        setError("");

        const response =
          await API.get(
            `/orders/${orderId}`
          );

        const fetchedOrder =
          getOrderDataFromResponse(
            response
          );

        if (!fetchedOrder) {

          throw new Error(
            "Order details were not returned by the server."
          );
        }

        if (mounted) {

          setOrder(
            fetchedOrder
          );
        }

      } catch (err) {

        console.error(
          "PAYMENT SCANNER ORDER ERROR:",
          err
        );

        if (mounted) {

          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Unable to load order details."
          );
        }

      } finally {

        if (mounted) {

          setLoading(false);
        }
      }
    };


    loadOrder();


    return () => {
      mounted = false;
    };

  }, [
    orderId,
    location?.state?.order,
  ]);


  /* =======================================================
     ORDER VALUES
  ======================================================= */

  const subtotal = useMemo(() => {

    if (!order) {
      return 0;
    }

    return Number(
      order.subtotal ??
      order.subTotal ??
      0
    );

  }, [order]);


  const deliveryCharge = useMemo(() => {

    if (!order) {
      return 0;
    }

    return Number(
      order.deliveryCharge ??
      order.deliveryCharges ??
      order.shippingCharge ??
      0
    );

  }, [order]);


  const discount = useMemo(() => {

    if (!order) {
      return 0;
    }

    return Number(
      order.discount ?? 0
    );

  }, [order]);


  /* =======================================================
     FINAL AMOUNT
  ======================================================= */

  const finalAmount = useMemo(() => {

    if (!order) {
      return 0;
    }

    const savedFinalAmount =
      Number(
        order.finalAmount
      );

    if (
      Number.isFinite(
        savedFinalAmount
      ) &&
      savedFinalAmount >= 0
    ) {

      return savedFinalAmount;
    }

    const calculated =
      subtotal -
      discount +
      deliveryCharge;

    return calculated >= 0
      ? calculated
      : 0;

  }, [
    order,
    subtotal,
    discount,
    deliveryCharge,
  ]);


  /* =======================================================
     PAYMENT STATUS
  ======================================================= */

  const paymentStatus =
    String(
      order?.paymentStatus ||
      "PENDING"
    ).toUpperCase();


  /* =======================================================
     WHATSAPP
  ======================================================= */

  const whatsappNumber =
    "916363645068";


  const whatsappMessage =
    `Hello Bhagyamma Hub,%0A%0A` +
    `I have completed payment for order ${orderNumber}.%0A` +
    `Order Amount: ${formatCurrency(finalAmount)}.%0A%0A` +
    `I am sending the payment screenshot for verification.`;


  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


  const handleWhatsApp = () => {

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  /* =======================================================
     PAYMENT COMPLETED
     
     IMPORTANT FIX
     
     OLD CODE:
     
       await API.delete("/cart");
     
     Problem:
       Backend cart may be cleared, but CartContext
       still contains old products.
     
     NEW CODE:
     
       await clearAll();
     
     This uses the existing CartContext clear function,
     which updates the backend AND React state.
  ======================================================= */

  const handlePaymentCompleted =
    async () => {

      if (clearingCart) {
        return;
      }


      if (!order) {

        setError(
          "Order details are not available."
        );

        return;
      }


      setClearingCart(true);

      setError("");


      try {

        /* =================================================
           STEP 1
           CLEAR SERVER + FRONTEND CART
        ================================================= */

        await clearAll();


        /* =================================================
           STEP 2
           EXTRA STORAGE CLEANUP

           This is only a safety cleanup for any old
           cart values stored in browser storage.
        ================================================= */

        try {

          localStorage.removeItem(
            "cart"
          );

          localStorage.removeItem(
            "cartItems"
          );

          sessionStorage.removeItem(
            "cart"
          );

          sessionStorage.removeItem(
            "cartItems"
          );

        } catch (storageError) {

          console.warn(
            "Cart storage cleanup warning:",
            storageError
          );
        }


        /* =================================================
           STEP 3
           MARK FRONTEND PAYMENT STEP COMPLETE
        ================================================= */

        setPaymentCompleted(
          true
        );


        /* =================================================
           STEP 4
           GO TO ORDERS

           CartContext is already empty before navigation.
        ================================================= */

        setTimeout(() => {

          navigate(
            "/member/orders",
            {
              replace: true,
            }
          );

        }, 1000);

      } catch (err) {

        console.error(
          "PAYMENT COMPLETED / CLEAR CART ERROR:",
          err
        );


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to clear the cart. Please try again."
        );

        setClearingCart(false);
      }
    };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "100vh",

          bgcolor: "#F5F7F6",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >

        <Stack
          spacing={2}
          alignItems="center"
        >

          <CircularProgress
            sx={{
              color: "#2E7D32",
            }}
          />

          <Typography
            color="text.secondary"
          >
            Loading payment details...
          </Typography>

        </Stack>

      </Box>
    );
  }


  /* =======================================================
     ERROR WITHOUT ORDER
  ======================================================= */

  if (
    error &&
    !order
  ) {

    return (
      <Box
        sx={{
          minHeight: "100vh",

          bgcolor: "#F5F7F6",

          py: 6,
        }}
      >

        <Container
          maxWidth="sm"
        >

          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
            }}
          >
            {error}
          </Alert>


          <Button
            fullWidth
            variant="contained"
            onClick={() =>
              navigate(-1)
            }
            sx={{
              mt: 3,

              py: 1.4,

              borderRadius: 3,

              bgcolor: "#2E7D32",

              textTransform: "none",

              fontWeight: 700,
            }}
          >
            Go Back
          </Button>

        </Container>

      </Box>
    );
  }


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (

    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F5F7F6",

        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >

      <Container
        maxWidth="md"
      >

        {/* TOP ACCENT */}

        <Box
          sx={{
            width: {
              xs: 90,
              sm: 110,
            },

            height: 8,

            bgcolor: "#2E7D32",

            borderRadius: 5,

            mx: "auto",

            mb: 2,
          }}
        />


        <Paper
          elevation={4}
          sx={{
            overflow: "hidden",

            borderRadius: {
              xs: 3,
              sm: 4,
            },
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <Box
            sx={{
              bgcolor: "#2E7D32",

              color: "#fff",

              px: {
                xs: 2.5,
                sm: 4,
              },

              py: {
                xs: 2.5,
                sm: 3,
              },
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >

              <Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >

                  <Payment />

                  <Typography
                    variant="h5"
                    fontWeight={800}
                  >
                    Scan & Pay
                  </Typography>

                </Stack>


                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,

                    opacity: 0.9,
                  }}
                >
                  Complete your payment using any
                  supported UPI app.
                </Typography>

              </Box>


              <Box
                sx={{
                  bgcolor:
                    paymentStatus === "PAID"
                      ? "#DFF5E2"
                      : "#FF9800",

                  color:
                    paymentStatus === "PAID"
                      ? "#2E7D32"
                      : "#111",

                  px: 1.5,

                  py: 0.7,

                  borderRadius: 3,

                  fontSize: 12,

                  fontWeight: 700,

                  whiteSpace:
                    "nowrap",
                }}
              >
                {paymentStatus === "PAID"
                  ? "Payment Verified"
                  : "Payment Pending"}
              </Box>

            </Stack>

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
            }}
          >

            {/* ORDER NUMBER */}

            <Box
              sx={{
                mb: 2,
              }}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Order Number
              </Typography>


              <Typography
                fontWeight={800}
              >
                {orderNumber ||
                  order?.orderNumber ||
                  "Order"}
              </Typography>

            </Box>


            {/* ERROR */}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,

                  borderRadius: 3,
                }}
              >
                {error}
              </Alert>
            )}


            {/* INFORMATION */}

            <Alert
              severity="info"
              icon={<InfoOutlined />}
              sx={{
                mb: 2,

                borderRadius: 3,
              }}
            >
              Scan the QR code below using
              PhonePe, Google Pay, Paytm, BHIM
              or another UPI app.
            </Alert>


            {/* =================================================
                AMOUNT
            ================================================= */}

            <Box
              sx={{
                border:
                  "1px solid #9BD39E",

                bgcolor: "#EAF7EB",

                borderRadius: 4,

                px: 2,

                py: {
                  xs: 3,
                  sm: 3.5,
                },

                textAlign: "center",

                mb: 2,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Amount to Pay
              </Typography>


              <Typography
                sx={{
                  mt: 0.5,

                  fontSize: {
                    xs: 38,
                    sm: 46,
                  },

                  lineHeight: 1.1,

                  fontWeight: 900,

                  color: "#2E7D32",
                }}
              >
                {formatCurrency(
                  finalAmount
                )}
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                Pay this exact amount
              </Typography>

            </Box>


            {/* =================================================
                PAYMENT BREAKDOWN
            ================================================= */}

            <Box
              sx={{
                bgcolor: "#FAFAFA",

                borderRadius: 3,

                px: 2,

                py: 1.5,

                mb: 2,
              }}
            >

              <Stack
                spacing={1.2}
              >

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >

                  <Typography
                    variant="body2"
                  >
                    Product Subtotal
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {formatCurrency(
                      subtotal
                    )}
                  </Typography>

                </Stack>


                {discount > 0 && (

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      variant="body2"
                    >
                      Discount
                    </Typography>


                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="error.main"
                    >
                      -{formatCurrency(
                        discount
                      )}
                    </Typography>

                  </Stack>

                )}


                <Stack
                  direction="row"
                  justifyContent="space-between"
                >

                  <Typography
                    variant="body2"
                  >
                    Delivery Charges
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : formatCurrency(
                          deliveryCharge
                        )}
                  </Typography>

                </Stack>


                <Divider />


                <Stack
                  direction="row"
                  justifyContent="space-between"
                >

                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    Total Payment
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={900}
                    color="#2E7D32"
                  >
                    {formatCurrency(
                      finalAmount
                    )}
                  </Typography>

                </Stack>

              </Stack>

            </Box>


            {/* =================================================
                QR CODE
            ================================================= */}

            <Box
              sx={{
                textAlign: "center",

                py: 2,
              }}
            >

              <Box
                sx={{
                  width: {
                    xs: 230,
                    sm: 280,
                  },

                  mx: "auto",

                  p: 1.5,

                  bgcolor: "#fff",

                  border:
                    "1px solid #E0E0E0",

                  borderRadius: 4,

                  boxShadow:
                    "0 5px 20px rgba(0,0,0,.08)",
                }}
              >

                <Box
                  component="img"
                  src={BhagyaScanner}
                  alt="Bhagyamma Hub UPI QR Code"
                  sx={{
                    width: "100%",

                    height: "auto",

                    display: "block",

                    objectFit: "contain",
                  }}
                />

              </Box>


              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",

                  mt: 1.5,
                }}
              >
                Scan this QR code with your
                UPI payment application.
              </Typography>

            </Box>


            <Divider
              sx={{
                my: 2,
              }}
            />


            {/* =================================================
                AFTER PAYMENT
            ================================================= */}

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                mb: 1.5,
              }}
            >
              After completing payment
            </Typography>


            <Stack
              spacing={1}
              sx={{
                mb: 2,
              }}
            >

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >

                <CheckCircle
                  sx={{
                    color: "#2E7D32",

                    fontSize: 18,
                  }}
                />

                <Typography
                  variant="body2"
                >
                  Pay exactly{" "}
                  <strong>
                    {formatCurrency(
                      finalAmount
                    )}
                  </strong>
                  .
                </Typography>

              </Stack>


              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >

                <CheckCircle
                  sx={{
                    color: "#2E7D32",

                    fontSize: 18,
                  }}
                />

                <Typography
                  variant="body2"
                >
                  Take a screenshot showing
                  the successful payment.
                </Typography>

              </Stack>


              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >

                <CheckCircle
                  sx={{
                    color: "#2E7D32",

                    fontSize: 18,
                  }}
                />

                <Typography
                  variant="body2"
                >
                  Send the screenshot to
                  Bhagyamma Hub through
                  WhatsApp.
                </Typography>

              </Stack>

            </Stack>


            {/* =================================================
                WHATSAPP
            ================================================= */}

            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsApp />}
              onClick={handleWhatsApp}
              sx={{
                py: 1.5,

                borderRadius: 3,

                bgcolor: "#25D366",

                color: "#fff",

                fontWeight: 800,

                textTransform: "none",

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

                textAlign: "center",

                mt: 1,
              }}
            >
              WhatsApp: +91 6363645068
            </Typography>


            {/* =================================================
                PENDING
            ================================================= */}

            <Alert
              severity="warning"
              sx={{
                mt: 2,

                borderRadius: 3,
              }}
            >
              Your payment will remain pending
              until Bhagyamma Hub manually
              verifies the payment.
            </Alert>


            {/* =================================================
                BEFORE COMPLETION
            ================================================= */}

            {!paymentCompleted && (

              <Alert
                severity="info"
                sx={{
                  mt: 1.5,

                  borderRadius: 3,
                }}
              >
                Your cart will be cleared after
                you confirm that payment has been
                completed.
              </Alert>

            )}


            {/* =================================================
                PAYMENT COMPLETED
            ================================================= */}

            {!paymentCompleted ? (

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  clearingCart ? (

                    <CircularProgress
                      size={18}
                      sx={{
                        color: "#fff",
                      }}
                    />

                  ) : (

                    <CheckCircle />

                  )
                }
                onClick={
                  handlePaymentCompleted
                }
                disabled={
                  clearingCart
                }
                sx={{
                  mt: 2,

                  py: 1.5,

                  borderRadius: 3,

                  bgcolor: "#2E7D32",

                  color: "#fff",

                  fontWeight: 800,

                  textTransform: "none",

                  "&:hover": {
                    bgcolor: "#256628",
                  },

                  "&:disabled": {
                    bgcolor: "#A5C9A7",

                    color: "#fff",
                  },
                }}
              >
                {clearingCart
                  ? "Clearing Cart..."
                  : "Payment Completed"}
              </Button>

            ) : (

              <Alert
                severity="success"
                sx={{
                  mt: 2,

                  borderRadius: 3,

                  fontWeight: 600,
                }}
              >
                Payment submitted successfully.
                Your cart has been cleared and your
                order is pending verification.
              </Alert>

            )}


            {/* =================================================
                SECURITY
            ================================================= */}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",

                textAlign: "center",

                mt: 2,
              }}
            >
              Your order details are securely
              processed.
            </Typography>

          </Box>

        </Paper>

      </Container>

    </Box>
  );
};


export default PaymentScanner;