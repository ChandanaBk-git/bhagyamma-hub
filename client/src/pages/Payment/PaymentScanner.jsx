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


  /* =======================================================
     GUEST MOBILE NUMBER
     
     IMPORTANT:
     Guest orders are traced using the mobile number.
     
     We DO NOT use:
     
       GET /orders/:id
     
     because that route requires authentication.
  ======================================================= */

  const initialGuestMobile =
    location?.state?.mobile ||
    location?.state?.order?.customerMobile ||
    location?.state?.order?.mobile ||
    location?.state?.order?.deliveryDetails?.mobile ||
    "";


  const [guestMobile, setGuestMobile] =
    useState(
      String(initialGuestMobile || "")
        .replace(/\D/g, "")
    );


  const [guestOrders, setGuestOrders] =
    useState([]);


  const [loadingGuestOrders, setLoadingGuestOrders] =
    useState(false);


  /* =======================================================
     ORDER NUMBER
  ======================================================= */

  const orderNumber =
    order?.orderNumber ||
    location?.state?.orderNumber ||
    "";


  /* =======================================================
     GET MOBILE FROM PENDING PAYMENT STORAGE
     
     This is important if the customer refreshes the
     payment page.
  ======================================================= */

  useEffect(() => {

    if (guestMobile) {
      return;
    }


    try {

      const pendingPayment =
        sessionStorage.getItem(
          "bhagyamma_pending_payment"
        );


      if (pendingPayment) {

        const parsed =
          JSON.parse(
            pendingPayment
          );


        const mobile =
          parsed?.mobile ||
          parsed?.customerMobile ||
          parsed?.order?.mobile ||
          parsed?.order?.customerMobile ||
          parsed?.order?.deliveryDetails?.mobile ||
          "";


        const cleaned =
          String(mobile || "")
            .replace(/\D/g, "");


        if (cleaned) {

          setGuestMobile(
            cleaned
          );

        }

      }

    } catch (storageError) {

      console.warn(
        "Unable to read pending payment mobile:",
        storageError
      );

    }

  }, [
    guestMobile,
  ]);


  /* =======================================================
     LOAD ORDER
     
     PRIORITY:
     
     1. Order passed directly from Checkout
     2. Pending payment stored in sessionStorage
     3. Guest order lookup using mobile number
     
     NEVER call:
     
       /orders/:id
     
     for guest customers.
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    const loadOrder = async () => {

      /* ---------------------------------------------------
         ORDER ALREADY PASSED FROM CHECKOUT
      --------------------------------------------------- */

      if (
        location?.state?.order
      ) {

        const stateOrder =
          location.state.order;


        const mobile =
          stateOrder?.customerMobile ||
          stateOrder?.mobile ||
          stateOrder?.deliveryDetails?.mobile ||
          "";


        if (mounted) {

          setOrder(
            stateOrder
          );


          if (
            !guestMobile &&
            mobile
          ) {

            setGuestMobile(
              String(mobile)
                .replace(/\D/g, "")
            );

          }


          setLoading(
            false
          );

        }


        return;
      }


      /* ---------------------------------------------------
         TRY PENDING PAYMENT STORAGE
      --------------------------------------------------- */

      let pendingOrder = null;


      try {

        const pendingPayment =
          sessionStorage.getItem(
            "bhagyamma_pending_payment"
          );


        if (pendingPayment) {

          const parsed =
            JSON.parse(
              pendingPayment
            );


          pendingOrder =
            parsed?.order ||
            parsed;

        }

      } catch (storageError) {

        console.warn(
          "Unable to read pending payment order:",
          storageError
        );

      }


      if (pendingOrder) {

        const mobile =
          pendingOrder?.customerMobile ||
          pendingOrder?.mobile ||
          pendingOrder?.deliveryDetails?.mobile ||
          "";


        if (mounted) {

          setOrder(
            pendingOrder
          );


          if (
            !guestMobile &&
            mobile
          ) {

            setGuestMobile(
              String(mobile)
                .replace(/\D/g, "")
            );

          }


          setLoading(
            false
          );

        }


        return;
      }


      /* ---------------------------------------------------
         GUEST LOOKUP BY MOBILE
      --------------------------------------------------- */

      const mobileToUse =
        guestMobile ||
        initialGuestMobile;


      const cleanedMobile =
        String(
          mobileToUse || ""
        ).replace(
          /\D/g,
          ""
        );


      if (
        cleanedMobile.length === 10
      ) {

        try {

          setLoadingGuestOrders(
            true
          );

          setError("");


          const response =
            await API.get(
              `/orders/guest/mobile/${cleanedMobile}`
            );


          const orders =
            getOrderDataFromResponse(
              response
            );


          const orderList =
            Array.isArray(orders)
              ? orders
              : [];


          if (mounted) {

            setGuestOrders(
              orderList
            );


            if (
              orderId
            ) {

              const matchedOrder =
                orderList.find(
                  (item) =>
                    String(
                      item?._id
                    ) ===
                    String(
                      orderId
                    )
                );


              if (
                matchedOrder
              ) {

                setOrder(
                  matchedOrder
                );

              }

            } else if (
              orderList.length
            ) {

              setOrder(
                orderList[0]
              );

            }

          }

        } catch (err) {

          console.error(
            "GUEST ORDER MOBILE LOOKUP ERROR:",
            err
          );


          if (mounted) {

            setError(
              err?.response?.data?.message ||
              "Unable to trace guest order using this mobile number."
            );

          }

        } finally {

          if (mounted) {

            setLoadingGuestOrders(
              false
            );

            setLoading(
              false
            );

          }

        }


        return;
      }


      /* ---------------------------------------------------
         MOBILE NUMBER NOT AVAILABLE
      --------------------------------------------------- */

      if (mounted) {

        setError(
          "Guest order mobile number is missing. Please enter the mobile number used during checkout."
        );


        setLoading(
          false
        );

      }

    };


    loadOrder();


    return () => {

      mounted = false;

    };

  }, [
    orderId,
    location?.state?.order,
    guestMobile,
    initialGuestMobile,
  ]);

    /* =======================================================
     TRACE GUEST ORDERS BY MOBILE
  ======================================================= */

  const handleTraceGuestOrders =
    async () => {

      const cleanedMobile =
        String(
          guestMobile || ""
        ).replace(
          /\D/g,
          ""
        );


      if (
        cleanedMobile.length !== 10
      ) {

        setError(
          "Please enter a valid 10-digit mobile number."
        );

        return;
      }


      try {

        setLoadingGuestOrders(
          true
        );

        setError("");


        const response =
          await API.get(
            `/orders/guest/mobile/${cleanedMobile}`
          );


        const orders =
          getOrderDataFromResponse(
            response
          );


        const orderList =
          Array.isArray(orders)
            ? orders
            : [];


        setGuestOrders(
          orderList
        );


        if (
          orderList.length
        ) {

          /*
           * If the current order ID exists,
           * select that order.
           *
           * Otherwise select the latest
           * guest order returned by backend.
           */

          const matched =
            orderId
              ? orderList.find(
                  (item) =>
                    String(
                      item?._id
                    ) ===
                    String(
                      orderId
                    )
                )
              : null;


          setOrder(
            matched ||
            orderList[0]
          );

        } else {

          setOrder(
            null
          );


          setError(
            "No guest orders were found for this mobile number."
          );

        }

      } catch (err) {

        console.error(
          "TRACE GUEST ORDERS ERROR:",
          err
        );


        setError(
          err?.response?.data?.message ||
          "Unable to trace orders using this mobile number."
        );

      } finally {

        setLoadingGuestOrders(
          false
        );

      }

    };


  /* =======================================================
     ORDER VALUES
  ======================================================= */

  const subtotal =
    useMemo(
      () => {

        if (!order) {
          return 0;
        }


        return Number(
          order.subtotal ??
          order.subTotal ??
          0
        );

      },
      [
        order,
      ]
    );


  const deliveryCharge =
    useMemo(
      () => {

        if (!order) {
          return 0;
        }


        return Number(
          order.deliveryCharge ??
          order.deliveryCharges ??
          order.shippingCharge ??
          0
        );

      },
      [
        order,
      ]
    );


  const discount =
    useMemo(
      () => {

        if (!order) {
          return 0;
        }


        return Number(
          order.discount ??
          0
        );

      },
      [
        order,
      ]
    );


  /* =======================================================
     FINAL AMOUNT
  ======================================================= */

  const finalAmount =
    useMemo(
      () => {

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

      },
      [
        order,
        subtotal,
        discount,
        deliveryCharge,
      ]
    );


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


  const handleWhatsApp =
    () => {

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

    };


  /* =======================================================
     PAYMENT COMPLETED
     
     IMPORTANT:
     
     Guest customers do NOT have a member account.
     
     Therefore we DO NOT navigate to:
     
       /member/orders
     
     Instead:
     
       1. Clear cart
       2. Keep order information visible
       3. Allow guest to trace order by mobile
  ======================================================= */

  const handlePaymentCompleted =
    async () => {

      if (
        clearingCart
      ) {

        return;

      }


      if (!order) {

        setError(
          "Order details are not available."
        );

        return;
      }


      setClearingCart(
        true
      );

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

        } catch (
          storageError
        ) {

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


        setClearingCart(
          false
        );

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


        setClearingCart(
          false
        );

      }

    };

      /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading
  ) {

    return (

      <Box
        sx={{
          minHeight: "100vh",

          bgcolor: "#F5F7F6",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          px: 2,
        }}
      >

        <Stack
          spacing={1.5}
          alignItems="center"
        >

          <CircularProgress
            size={30}
            sx={{
              color: "#2E7D32",
            }}
          />

          <Typography
            sx={{
              fontSize: 13,
            }}
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

          py: {
            xs: 3,
            sm: 5,
          },

          px: 2,
        }}
      >

        <Container
          maxWidth="sm"
        >

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },

              border:
                "1px solid #E0E0E0",

              borderRadius: 0,
            }}
          >

            <Alert
              severity="error"
              sx={{
                borderRadius: 0,

                fontSize: 13,
              }}
            >
              {error}
            </Alert>


            {/* =========================================
                GUEST MOBILE TRACE
            ========================================= */}

            <Typography
              sx={{
                mt: 2,

                mb: 0.7,

                fontSize: 14,

                fontWeight: 800,
              }}
            >
              Trace Guest Order
            </Typography>


            <Typography
              sx={{
                mb: 1.2,

                fontSize: 12,

                color: "text.secondary",
              }}
            >
              Enter the mobile number used during
              checkout.
            </Typography>


            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >

              <Box
                component="input"
                value={guestMobile}
                onChange={(event) =>
                  setGuestMobile(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                sx={{
                  flex: 1,

                  minWidth: 0,

                  height: 40,

                  px: 1.3,

                  border:
                    "1px solid #D5D5D5",

                  outline: "none",

                  fontSize: 13,

                  bgcolor: "#fff",

                  boxSizing: "border-box",
                }}
              />


              <Button
                variant="contained"
                onClick={
                  handleTraceGuestOrders
                }
                disabled={
                  loadingGuestOrders ||
                  guestMobile.length !== 10
                }
                sx={{
                  height: 40,

                  minWidth: {
                    xs: "100%",
                    sm: 120,
                  },

                  borderRadius: 0,

                  bgcolor: "#2E7D32",

                  textTransform: "none",

                  fontSize: 13,

                  fontWeight: 700,

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "#256628",

                    boxShadow: "none",
                  },
                }}
              >
                {loadingGuestOrders
                  ? "Checking..."
                  : "Trace Order"}
              </Button>

            </Stack>


            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate(-1)
              }
              sx={{
                mt: 1.5,

                height: 40,

                borderRadius: 0,

                borderColor: "#2E7D32",

                color: "#2E7D32",

                textTransform: "none",

                fontSize: 13,

                fontWeight: 700,
              }}
            >
              Go Back
            </Button>

          </Paper>

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
          xs: 2,
          sm: 3,
        },

        px: {
          xs: 1,
          sm: 2,
        },
      }}
    >

      <Container
        maxWidth="md"
        sx={{
          px: {
            xs: 0,
            sm: 1,
          },
        }}
      >
  <Button
    onClick={() => navigate(-1)}
    sx={{
      mb: 1,
      px: 0,
      minWidth: "auto",
      color: "#2E7D32",
      fontSize: 12,
      fontWeight: 700,
      textTransform: "none",
      boxShadow: "none",
      "&:hover": {
        bgcolor: "transparent",
        boxShadow: "none",
      },
    }}
  >
    ← Back to Checkout
  </Button>
        {/* ================================================
            TOP ACCENT
        ================================================ */}

        <Box
          sx={{
            width: {
              xs: 70,
              sm: 90,
            },

            height: 5,

            bgcolor: "#2E7D32",

            mx: "auto",

            mb: 1.5,
          }}
        />


        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",

            border:
              "1px solid #E0E0E0",

            borderRadius: 0,
          }}
        >

          {/* ==============================================
              HEADER
          ============================================== */}

          <Box
            sx={{
              bgcolor: "#2E7D32",

              color: "#fff",

              px: {
                xs: 1.8,
                sm: 3,
              },

              py: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >

              <Box
                sx={{
                  minWidth: 0,
                }}
              >

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.7}
                >

                  <Payment
                    sx={{
                      fontSize: {
                        xs: 20,
                        sm: 23,
                      },
                    }}
                  />


                  <Typography
                    sx={{
                      fontSize: {
                        xs: 18,
                        sm: 22,
                      },

                      lineHeight: 1.2,

                      fontWeight: 800,
                    }}
                  >
                    Scan & Pay
                  </Typography>

                </Stack>


                <Typography
                  sx={{
                    mt: 0.4,

                    fontSize: {
                      xs: 10.5,
                      sm: 12,
                    },

                    opacity: 0.9,
                  }}
                >
                  Complete payment using any
                  supported UPI app.
                </Typography>

              </Box>


              <Box
                sx={{
                  bgcolor:
                    paymentStatus === "PAID"
                      ? "#DFF5E2"
                      : "#FFB74D",

                  color:
                    paymentStatus === "PAID"
                      ? "#2E7D32"
                      : "#111",

                  px: 1,

                  py: 0.5,

                  fontSize: {
                    xs: 9,
                    sm: 11,
                  },

                  fontWeight: 700,

                  whiteSpace: "nowrap",
                }}
              >
                {paymentStatus === "PAID"
                  ? "VERIFIED"
                  : "PENDING"}
              </Box>

            </Stack>

          </Box>


          {/* ==============================================
              CONTENT
          ============================================== */}

          <Box
            sx={{
              p: {
                xs: 1.5,
                sm: 2.5,
              },
            }}
          >

            {/* ==========================================
                ORDER NUMBER
            ========================================== */}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mb: 1.2,
              }}
            >

              <Box>

                <Typography
                  sx={{
                    display: "block",

                    fontSize: 10,

                    color: "text.secondary",

                    lineHeight: 1.2,
                  }}
                >
                  Order Number
                </Typography>


                <Typography
                  sx={{
                    fontSize: 14,

                    fontWeight: 800,
                  }}
                >
                  {orderNumber ||
                    order?.orderNumber ||
                    "Order"}
                </Typography>

              </Box>


              {guestMobile && (

                <Box
                  sx={{
                    textAlign: "right",
                  }}
                >

                  <Typography
                    sx={{
                      display: "block",

                      fontSize: 10,

                      color: "text.secondary",
                    }}
                  >
                    Mobile
                  </Typography>


                  <Typography
                    sx={{
                      fontSize: 12,

                      fontWeight: 700,
                    }}
                  >
                    {guestMobile}
                  </Typography>

                </Box>

              )}

            </Stack>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

              <Alert
                severity="error"
                sx={{
                  mb: 1.5,

                  borderRadius: 0,

                  py: 0.3,

                  fontSize: 12,
                }}
              >
                {error}
              </Alert>

            )}


            {/* ==========================================
                INFORMATION
            ========================================== */}

            <Alert
              severity="info"
              icon={
                <InfoOutlined
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={{
                mb: 1.5,

                borderRadius: 0,

                py: 0.3,

                fontSize: {
                  xs: 10.5,
                  sm: 12,
                },

                "& .MuiAlert-icon": {
                  py: 0.5,
                },
              }}
            >
              Scan the QR code using PhonePe,
              Google Pay, Paytm, BHIM or another
              UPI app.
            </Alert>


            {/* ==========================================
                AMOUNT
            ========================================== */}

            <Box
              sx={{
                border:
                  "1px solid #9BD39E",

                bgcolor: "#EAF7EB",

                px: 1.5,

                py: {
                  xs: 1.5,
                  sm: 2,
                },

                textAlign: "center",

                mb: 1.5,
              }}
            >

              <Typography
                sx={{
                  fontSize: 10.5,

                  color: "text.secondary",
                }}
              >
                Amount to Pay
              </Typography>


              <Typography
                sx={{
                  mt: 0.2,

                  fontSize: {
                    xs: 30,
                    sm: 38,
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
                sx={{
                  mt: 0.4,

                  fontSize: 10,

                  color: "text.secondary",
                }}
              >
                Pay this exact amount
              </Typography>

            </Box>


            {/* ==========================================
                PAYMENT BREAKDOWN
            ========================================== */}

            <Box
              sx={{
                bgcolor: "#FAFAFA",

                border:
                  "1px solid #EEEEEE",

                px: 1.5,

                py: 1.1,

                mb: 1.5,
              }}
            >

              <Stack
                spacing={0.7}
              >

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >

                  <Typography
                    sx={{
                      fontSize: 11.5,
                    }}
                  >
                    Product Subtotal
                  </Typography>


                  <Typography
                    sx={{
                      fontSize: 11.5,

                      fontWeight: 700,
                    }}
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
                      sx={{
                        fontSize: 11.5,
                      }}
                    >
                      Discount
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 11.5,

                        fontWeight: 700,

                        color: "error.main",
                      }}
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
                    sx={{
                      fontSize: 11.5,
                    }}
                  >
                    Delivery Charges
                  </Typography>


                  <Typography
                    sx={{
                      fontSize: 11.5,

                      fontWeight: 700,
                    }}
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
                    sx={{
                      fontSize: 12,

                      fontWeight: 800,
                    }}
                  >
                    Total Payment
                  </Typography>


                  <Typography
                    sx={{
                      fontSize: 12,

                      fontWeight: 900,

                      color: "#2E7D32",
                    }}
                  >
                    {formatCurrency(
                      finalAmount
                    )}
                  </Typography>

                </Stack>

              </Stack>

            </Box>

                        {/* ==========================================
                QR CODE
            ========================================== */}

            <Box
              sx={{
                textAlign: "center",

                py: 1,
              }}
            >

              <Box
                sx={{
                  width: {
                    xs: 190,
                    sm: 230,
                  },

                  mx: "auto",

                  p: 1,

                  bgcolor: "#fff",

                  border:
                    "1px solid #E0E0E0",

                  boxShadow:
                    "0 3px 12px rgba(0,0,0,.06)",
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
                sx={{
                  display: "block",

                  mt: 0.8,

                  fontSize: 10,

                  color: "text.secondary",
                }}
              >
                Scan this QR code with your
                UPI payment application.
              </Typography>

            </Box>


            <Divider
              sx={{
                my: 1.5,
              }}
            />


            {/* ==========================================
                AFTER PAYMENT
            ========================================== */}

            <Typography
              sx={{
                mb: 1,

                fontSize: {
                  xs: 15,
                  sm: 17,
                },

                fontWeight: 800,
              }}
            >
              After completing payment
            </Typography>


            <Stack
              spacing={0.7}
              sx={{
                mb: 1.5,
              }}
            >

              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
              >

                <CheckCircle
                  sx={{
                    color: "#2E7D32",

                    fontSize: 16,
                  }}
                />


                <Typography
                  sx={{
                    fontSize: 11.5,
                  }}
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
                spacing={0.8}
                alignItems="center"
              >

                <CheckCircle
                  sx={{
                    color: "#2E7D32",

                    fontSize: 16,
                  }}
                />


                <Typography
                  sx={{
                    fontSize: 11.5,
                  }}
                >
                  Take a screenshot showing
                  the successful payment.
                </Typography>

              </Stack>


              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
              >

                <CheckCircle
                  sx={{
                    color: "#2E7D32",

                    fontSize: 16,
                  }}
                />


                <Typography
                  sx={{
                    fontSize: 11.5,
                  }}
                >
                  Send the screenshot to
                  Bhagyamma Hub through
                  WhatsApp.
                </Typography>

              </Stack>

            </Stack>


            {/* ==========================================
                WHATSAPP
            ========================================== */}

            <Button
              fullWidth
              variant="contained"
              startIcon={
                <WhatsApp
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              onClick={
                handleWhatsApp
              }
              sx={{
                height: 42,

                borderRadius: 0,

                bgcolor: "#25D366",

                color: "#fff",

                fontWeight: 800,

                fontSize: 12,

                textTransform: "none",

                boxShadow: "none",

                "&:hover": {
                  bgcolor: "#1EBE5D",

                  boxShadow: "none",
                },
              }}
            >
              Send Payment Screenshot on WhatsApp
            </Button>


            <Typography
              sx={{
                display: "block",

                textAlign: "center",

                mt: 0.7,

                fontSize: 10,

                color: "text.secondary",
              }}
            >
              WhatsApp: +91 6363645068
            </Typography>


            {/* ==========================================
                PAYMENT PENDING
            ========================================== */}

            <Alert
              severity="warning"
              sx={{
                mt: 1.5,

                borderRadius: 0,

                py: 0.3,

                fontSize: 11,

                "& .MuiAlert-icon": {
                  fontSize: 18,
                },
              }}
            >
              Your payment will remain pending until
              Bhagyamma Hub verifies the payment.
            </Alert>


            {/* ==========================================
                BEFORE COMPLETION
            ========================================== */}

            {!paymentCompleted && (

              <Alert
                severity="info"
                sx={{
                  mt: 1,

                  borderRadius: 0,

                  py: 0.3,

                  fontSize: 11,

                  "& .MuiAlert-icon": {
                    fontSize: 18,
                  },
                }}
              >
                Your cart will be cleared after you
                confirm that payment is completed.
              </Alert>

            )}


            {/* ==========================================
                PAYMENT COMPLETED
            ========================================== */}

            {!paymentCompleted ? (

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  clearingCart ? (

                    <CircularProgress
                      size={17}
                      sx={{
                        color: "#fff",
                      }}
                    />

                  ) : (

                    <CheckCircle
                      sx={{
                        fontSize: 18,
                      }}
                    />

                  )
                }
                onClick={
                  handlePaymentCompleted
                }
                disabled={
                  clearingCart
                }
                sx={{
                  mt: 1.5,

                  height: 42,

                  borderRadius: 0,

                  bgcolor: "#2E7D32",

                  color: "#fff",

                  fontWeight: 800,

                  fontSize: 12,

                  textTransform: "none",

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "#256628",

                    boxShadow: "none",
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
                  mt: 1.5,

                  borderRadius: 0,

                  py: 0.5,

                  fontSize: 11,

                  "& .MuiAlert-icon": {
                    fontSize: 18,
                  },
                }}
              >
                Payment submitted successfully.
                Your cart has been cleared and your
                order is pending verification.
              </Alert>

            )}


            {/* ==========================================
                GUEST ORDER TRACKING BY MOBILE
            ========================================== */}

            <Box
              sx={{
                mt: 1.5,

                p: 1.5,

                border:
                  "1px solid #E0E0E0",

                bgcolor: "#FAFAFA",
              }}
            >

              <Typography
                sx={{
                  mb: 0.4,

                  fontSize: 13,

                  fontWeight: 800,
                }}
              >
                Track Your Order
              </Typography>


              <Typography
                sx={{
                  display: "block",

                  mb: 1,

                  fontSize: 10.5,

                  color: "text.secondary",
                }}
              >
                Guest orders are traced using the
                mobile number entered during checkout.
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
              >

                <Box
                  component="input"
                  value={guestMobile}
                  onChange={(event) =>
                    setGuestMobile(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  sx={{
                    flex: 1,

                    minWidth: 0,

                    height: 40,

                    px: 1.3,

                    border:
                      "1px solid #D5D5D5",

                    outline: "none",

                    fontSize: 12,

                    bgcolor: "#fff",

                    boxSizing: "border-box",
                  }}
                />


                <Button
                  variant="contained"
                  onClick={
                    handleTraceGuestOrders
                  }
                  disabled={
                    loadingGuestOrders ||
                    guestMobile.length !== 10
                  }
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 120,
                    },

                    height: 40,

                    borderRadius: 0,

                    bgcolor: "#2E7D32",

                    textTransform: "none",

                    fontSize: 12,

                    fontWeight: 700,

                    boxShadow: "none",

                    "&:hover": {
                      bgcolor: "#256628",

                      boxShadow: "none",
                    },
                  }}
                >
                  {loadingGuestOrders
                    ? "Checking..."
                    : "Trace Order"}
                </Button>

              </Stack>


              {/* ========================================
                  FOUND GUEST ORDERS
              ======================================== */}

              {guestOrders.length > 0 && (

                <Stack
                  spacing={0.7}
                  sx={{
                    mt: 1.2,
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: 10.5,

                      fontWeight: 800,
                    }}
                  >
                    Orders found:{" "}
                    {guestOrders.length}
                  </Typography>


                  {guestOrders
                    .slice(0, 5)
                    .map(
                      (guestOrder) => (

                        <Box
                          key={
                            guestOrder?._id ||
                            guestOrder?.orderNumber
                          }
                          sx={{
                            p: 1,

                            border:
                              "1px solid #E6E6E6",

                            bgcolor: "#fff",
                          }}
                        >

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={1}
                          >

                            <Typography
                              sx={{
                                fontSize: 10.5,

                                fontWeight: 800,
                              }}
                            >
                              {guestOrder?.orderNumber ||
                                "Order"}
                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 10.5,

                                fontWeight: 800,

                                color:
                                  String(
                                    guestOrder?.paymentStatus ||
                                    "PENDING"
                                  ).toUpperCase() ===
                                  "PAID"
                                    ? "#2E7D32"
                                    : "#E65100",
                              }}
                            >
                              {String(
                                guestOrder?.paymentStatus ||
                                "PENDING"
                              ).toUpperCase()}
                            </Typography>

                          </Stack>


                          <Typography
                            sx={{
                              fontSize: 10,

                              color: "text.secondary",
                            }}
                          >
                            Order status:{" "}
                            {guestOrder?.status ||
                              guestOrder?.orderStatus ||
                              "PENDING"}
                          </Typography>

                        </Box>

                      )
                    )}

                </Stack>

              )}

            </Box>

                        {/* ==========================================
                SECURITY / FINAL NOTE
            ========================================== */}

            <Typography
              sx={{
                display: "block",

                textAlign: "center",

                mt: 1.5,

                fontSize: 10,

                color: "text.secondary",
              }}
            >
              Your guest order is linked to the mobile
              number used during checkout.
            </Typography>


            {/* ==========================================
                CURRENT ORDER SUMMARY
            ========================================== */}

            {order && (

              <Box
                sx={{
                  mt: 1.5,

                  p: 1.5,

                  border:
                    "1px solid #E0E0E0",

                  bgcolor: "#fff",
                }}
              >

                <Typography
                  sx={{
                    mb: 0.8,

                    fontSize: 13,

                    fontWeight: 800,
                  }}
                >
                  Current Order
                </Typography>


                <Stack
                  spacing={0.6}
                >

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      sx={{
                        fontSize: 11,

                        color: "text.secondary",
                      }}
                    >
                      Order Number
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 11,

                        fontWeight: 700,
                      }}
                    >
                      {order?.orderNumber ||
                        "—"}
                    </Typography>

                  </Stack>


                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      sx={{
                        fontSize: 11,

                        color: "text.secondary",
                      }}
                    >
                      Mobile
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 11,

                        fontWeight: 700,
                      }}
                    >
                      {guestMobile ||
                        order?.customerMobile ||
                        order?.mobile ||
                        "—"}
                    </Typography>

                  </Stack>


                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      sx={{
                        fontSize: 11,

                        color: "text.secondary",
                      }}
                    >
                      Payment
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 11,

                        fontWeight: 800,

                        color:
                          paymentStatus ===
                          "PAID"
                            ? "#2E7D32"
                            : "#E65100",
                      }}
                    >
                      {paymentStatus}
                    </Typography>

                  </Stack>


                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      sx={{
                        fontSize: 11,

                        color: "text.secondary",
                      }}
                    >
                      Order Status
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 11,

                        fontWeight: 700,
                      }}
                    >
                      {order?.status ||
                        order?.orderStatus ||
                        "PENDING"}
                    </Typography>

                  </Stack>


                  <Divider
                    sx={{
                      my: 0.4,
                    }}
                  />


                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      sx={{
                        fontSize: 12,

                        fontWeight: 800,
                      }}
                    >
                      Total
                    </Typography>


                    <Typography
                      sx={{
                        fontSize: 12,

                        fontWeight: 900,

                        color: "#2E7D32",
                      }}
                    >
                      {formatCurrency(
                        finalAmount
                      )}
                    </Typography>

                  </Stack>

                </Stack>

              </Box>

            )}


          </Box>

        </Paper>

      </Container>

    </Box>

  );

};


export default PaymentScanner;