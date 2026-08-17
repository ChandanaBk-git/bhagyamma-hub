import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  ArrowBack,
  LockOutlined,
  QrCode2,
  ShoppingBagOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import { createOrder } from "../../services/order.service";


/* =========================================================
   CHECKOUT PAGE
========================================================= */

const Checkout = () => {

  const navigate = useNavigate();


  /* =======================================================
     CART
     
     IMPORTANT:
     Your CartContext exposes:
     
     cart
     cart.items
     cart.totalAmount
     cart.totalItems
     
     It does NOT expose cartItems directly.
  ======================================================= */

  const {
    cart,
    loading: cartLoading,
  } = useCart();

  const cartItems =
    cart?.items || [];

  const subtotal =
    Number(
      cart?.totalAmount || 0
    );


  /* =======================================================
     AUTH
  ======================================================= */

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isLoggedIn =
    Boolean(token);


  /* =======================================================
     USER
  ======================================================= */

  let savedUser = {};

  try {

    savedUser =
      JSON.parse(
        localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "{}"
      );

  } catch (error) {

    console.error(
      "User Parse Error:",
      error
    );

  }


  /* =======================================================
     FORM
  ======================================================= */

  const [formData, setFormData] =
    useState({

      name:
        savedUser?.name || "",

      mobile:
        savedUser?.mobile || "",

      email:
        savedUser?.email || "",

      address:
        savedUser?.address || "",

      city:
        savedUser?.city || "",

      state:
        savedUser?.state ||
        "Karnataka",

      pincode:
        savedUser?.pincode || "",

    });


  /* =======================================================
     STATE
  ======================================================= */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [cartReady, setCartReady] =
    useState(false);


  /* =======================================================
     DELIVERY CHARGE
  ======================================================= */

  const deliveryCharge = 50;


  /* =======================================================
     GRAND TOTAL
  ======================================================= */

  const grandTotal =
    subtotal +
    deliveryCharge;


  /* =======================================================
     WAIT FOR CART
     
     This prevents Checkout from immediately
     displaying "Cart Empty" while CartContext
     is still loading the cart.
  ======================================================= */

  useEffect(() => {

    if (!cartLoading) {

      setCartReady(true);

    }

  }, [
    cartLoading,
  ]);


  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");

  };


  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {

    const name =
      formData.name.trim();

    const mobile =
      formData.mobile
        .replace(/\D/g, "");

    const email =
      formData.email.trim();

    const address =
      formData.address.trim();

    const city =
      formData.city.trim();

    const state =
      formData.state.trim();

    const pincode =
      formData.pincode
        .replace(/\D/g, "");


    /* NAME */

    if (!name) {

      setError(
        "Please enter your full name."
      );

      return false;

    }


    /* MOBILE */

    if (
      mobile.length !== 10
    ) {

      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return false;

    }


    /* EMAIL */

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return false;

    }


    /* ADDRESS */

    if (!address) {

      setError(
        "Please enter your delivery address."
      );

      return false;

    }


    /* CITY */

    if (!city) {

      setError(
        "Please enter your city."
      );

      return false;

    }


    /* STATE */

    if (!state) {

      setError(
        "Please enter your state."
      );

      return false;

    }


    /* PINCODE */

    if (
      pincode.length !== 6
    ) {

      setError(
        "Please enter a valid 6-digit pincode."
      );

      return false;

    }


    /* CART */

    if (
      !cartItems.length
    ) {

      setError(
        "Your cart is empty."
      );

      return false;

    }


    return true;

  };


  /* =======================================================
     BUILD ORDER ITEMS
     
     Backend expects:
     
     items: [
       {
         productId,
         quantity
       }
     ]
  ======================================================= */

  const buildOrderItems = () => {

    return cartItems.map(
      (item) => {

        const product =
          item?.product ||
          null;

        const productId =
          item?.productId ||
          product?._id;

        const quantity =
          Number(
            item?.quantity || 1
          );

        return {

          productId,

          quantity,

        };

      }
    );

  };


  /* =======================================================
     CREATE ORDER
  ======================================================= */

  const handlePlaceOrder = async (
    event
  ) => {

    event.preventDefault();

    setError("");

    setSuccess("");


    /* -----------------------------------------------------
       VALIDATE
    ----------------------------------------------------- */

    if (
      !validateForm()
    ) {

      return;

    }


    /* -----------------------------------------------------
       BUILD ITEMS
    ----------------------------------------------------- */

    const items =
      buildOrderItems();


    /* -----------------------------------------------------
       CHECK PRODUCT IDS
    ----------------------------------------------------- */

    const invalidItem =
      items.find(
        (item) =>
          !item.productId
      );


    if (invalidItem) {

      console.error(
        "Invalid Cart Item:",
        invalidItem,
        cartItems
      );

      setError(
        "One of the products in your cart is invalid. Please remove it and add it again."
      );

      return;

    }


    /* -----------------------------------------------------
       START LOADING
    ----------------------------------------------------- */

    setLoading(true);


    try {

      const orderPayload = {

        name:
          formData.name.trim(),

        mobile:
          formData.mobile
            .replace(/\D/g, ""),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        address:
          formData.address.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        pincode:
          formData.pincode
            .replace(/\D/g, ""),

        deliveryCharge,

        /*
         * VERY IMPORTANT
         *
         * Guest backend requires items.
         */

        items,

      };


      console.log(
        "Creating order:",
        orderPayload
      );


      /* =================================================
         CREATE ORDER
         
         order.service.js must decide:
         
         Member:
         POST /orders
         
         Guest:
         POST /orders/guest
      ================================================= */

      const response =
        await createOrder(
          orderPayload
        );


      console.log(
        "Create Order Response:",
        response
      );


      /* =================================================
         GET ORDER FROM RESPONSE
      ================================================= */

      const order =
        response?.data ||
        response;


      if (!order) {

        throw new Error(
          "Order created but order details were not returned."
        );

      }


      /* =================================================
         ORDER DETAILS
      ================================================= */

      const orderId =
        order?._id ||
        order?.id ||
        null;

      const orderNumber =
        order?.orderNumber ||
        null;

      const amount =
        Number(
          order?.finalAmount ??
          order?.totalAmount ??
          grandTotal
        );


      console.log(
        "Order Details:",
        {
          orderId,
          orderNumber,
          amount,
        }
      );


      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess(
        "Order created successfully. Opening payment scanner..."
      );


      /* =================================================
         OPEN PAYMENT SCANNER
      ================================================= */

      navigate(
        "/payment/scan",
        {
          state: {

            orderId,

            orderNumber,

            amount,

            isMember:
              isLoggedIn,

          },
        }
      );


    } catch (error) {

      console.error(
        "CREATE ORDER ERROR:",
        error
      );


      const status =
        error?.response?.status;


      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;


      /* =================================================
         AUTH ERROR
      ================================================= */

      if (
        status === 401
      ) {

        setError(
          "Authentication failed. Please refresh the page and try again."
        );

      } else {

        setError(
          backendMessage ||
          "Unable to create your order. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     BACK TO CART
  ======================================================= */

  const handleBackToCart = () => {

    if (isLoggedIn) {

      navigate(
        "/member/cart"
      );

    } else {

      navigate(
        "/cart"
      );

    }

  };


  /* =======================================================
     CART LOADING
  ======================================================= */

  if (
    cartLoading &&
    !cartReady
  ) {

    return (

      <Box
        sx={{
          minHeight:
            "70vh",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          bgcolor:
            "#F5F7F5",

        }}
      >

        <CircularProgress
          color="success"
        />

      </Box>

    );

  }


  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (
    cartReady &&
    !cartItems.length
  ) {

    return (

      <Box
        sx={{
          minHeight:
            "80vh",

          bgcolor:
            "#F5F7F5",

          py: {
            xs: 4,
            sm: 6,
          },

          display:
            "flex",

          alignItems:
            "flex-start",

        }}
      >

        <Container
          maxWidth="sm"
        >

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,

              textAlign:
                "center",

              border:
                "1px solid #E0E0E0",

              boxShadow:
                "0 8px 30px rgba(0,0,0,.06)",

            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 3,
                  sm: 5,
                },
              }}
            >

              <ShoppingBagOutlined
                sx={{
                  fontSize: 70,

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
                Your Cart is Empty
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 3,
                }}
              >
                Add some products
                before proceeding
                to checkout.
              </Typography>

              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  navigate(
                    "/products"
                  )
                }
                sx={{
                  textTransform:
                    "none",

                  fontWeight:
                    700,

                  px: 4,

                  borderRadius: 2,

                }}
              >
                Browse Products
              </Button>

            </CardContent>

          </Card>

        </Container>

      </Box>

    );

  }


  /* =======================================================
     MAIN CHECKOUT
  ======================================================= */

  return (

    <Box
      sx={{
        minHeight:
          "100vh",

        bgcolor:
          "#F5F7F5",

        py: {
          xs: 2,
          sm: 3,
          md: 5,
        },

      }}
    >

      <Container
        maxWidth="md"
      >

        {/* =================================================
            BACK TO CART
        ================================================= */}

        <Button
          startIcon={
            <ArrowBack />
          }
          onClick={
            handleBackToCart
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
            HEADER
        ================================================= */}

        <Box
          sx={{
            mb: 3,
          }}
        >

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2.1rem",
              },
            }}
          >
            Checkout
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Enter your delivery details
            and continue to secure UPI
            payment.
          </Typography>

        </Box>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>

        )}


        {/* =================================================
            GUEST MESSAGE
        ================================================= */}

        {!isLoggedIn && (

          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            You can continue as a guest.
            Your mobile number is required
            for order identification.
          </Alert>

        )}


        {/* =================================================
            FORM
        ================================================= */}

        <Box
          component="form"
          onSubmit={
            handlePlaceOrder
          }
        >

          {/* =================================================
              DELIVERY INFORMATION
          ================================================= */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,

              border:
                "1px solid #E0E0E0",

              mb: 3,

            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  mb: 1.5,
                }}
              >
                Delivery Information
              </Typography>

              <Divider
                sx={{
                  mb: 2.5,
                }}
              />


              <Grid
                container
                spacing={2}
              >

                {/* NAME */}

                <Grid
                  item
                  xs={12}
                >

                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="name"
                  />

                </Grid>


                {/* MOBILE */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                >

                  <TextField
                    fullWidth
                    required
                    label="Mobile Number"
                    name="mobile"
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                    inputProps={{
                      maxLength: 10,
                    }}
                    autoComplete="tel"
                  />

                </Grid>


                {/* EMAIL */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                >

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="email"
                  />

                </Grid>


                {/* ADDRESS */}

                <Grid
                  item
                  xs={12}
                >

                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={3}
                    label="Delivery Address"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="street-address"
                  />

                </Grid>


                {/* CITY */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                >

                  <TextField
                    fullWidth
                    required
                    label="City"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="address-level2"
                  />

                </Grid>


                {/* STATE */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                >

                  <TextField
                    fullWidth
                    required
                    label="State"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="address-level1"
                  />

                </Grid>


                {/* PINCODE */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                >

                  <TextField
                    fullWidth
                    required
                    label="Pincode"
                    name="pincode"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    inputProps={{
                      maxLength: 6,
                    }}
                    autoComplete="postal-code"
                  />

                </Grid>

              </Grid>

            </CardContent>

          </Card>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,

              border:
                "1px solid #E0E0E0",

            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  mb: 1.5,
                }}
              >
                Order Summary
              </Typography>

              <Divider
                sx={{
                  mb: 2,
                }}
              />


              {/* PRODUCTS */}

              <Stack
                spacing={1.5}
              >

                {cartItems.map(
                  (
                    item,
                    index
                  ) => {

                    const product =
                      item?.product ||
                      {};

                    const name =
                      product?.productName ||
                      product?.name ||
                      item?.productName ||
                      "Product";

                    const quantity =
                      Number(
                        item?.quantity ||
                        1
                      );

                    const price =
                      Number(
                        item?.price ??
                        product?.price ??
                        0
                      );

                    const total =
                      price *
                      quantity;

                    return (

                      <Box
                        key={
                          item?._id ||
                          item?.productId ||
                          index
                        }
                        sx={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "flex-start",

                          gap: 2,

                        }}
                      >

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >

                          <Typography
                            fontWeight={600}
                            sx={{
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Qty:{" "}
                            {quantity}
                          </Typography>

                        </Box>

                        <Typography
                          fontWeight={700}
                          sx={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          ₹
                          {total.toLocaleString(
                            "en-IN"
                          )}
                        </Typography>

                      </Box>

                    );

                  }
                )}

              </Stack>


              <Divider
                sx={{
                  my: 2,
                }}
              />


              {/* SUBTOTAL */}

              <Box
                sx={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  mb: 1,
                }}
              >

                <Typography>
                  Subtotal
                </Typography>

                <Typography>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>


              {/* DELIVERY */}

              <Box
                sx={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  mb: 1,
                }}
              >

                <Typography>
                  Delivery Charges
                </Typography>

                <Typography>
                  ₹
                  {deliveryCharge.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>


              <Divider
                sx={{
                  my: 2,
                }}
              />


              {/* GRAND TOTAL */}

              <Box
                sx={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                }}
              >

                <Typography
                  fontWeight={900}
                >
                  Grand Total
                </Typography>

                <Typography
                  fontWeight={900}
                  sx={{
                    color:
                      "#2E7D32",

                    fontSize:
                      "1.3rem",
                  }}
                >
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>


              {/* =================================================
                  PAYMENT INFORMATION
              ================================================= */}

              <Box
                sx={{
                  mt: 2.5,

                  p: {
                    xs: 1.5,
                    sm: 2,
                  },

                  bgcolor:
                    "#E8F5E9",

                  border:
                    "1px solid #A5D6A7",

                  borderRadius: 2,

                }}
              >

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                >

                  <QrCode2
                    sx={{
                      color:
                        "#2E7D32",

                      mt: 0.2,
                    }}
                  />

                  <Box>

                    <Typography
                      fontWeight={800}
                      color="#1B5E20"
                    >
                      UPI Scan & Pay
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                      }}
                    >
                      After clicking the
                      button below, your
                      order will be created
                      and you will be taken
                      to the payment scanner.
                    </Typography>

                  </Box>

                </Stack>

              </Box>


              {/* =================================================
                  CONTINUE TO SCAN & PAY
              ================================================= */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                size="large"
                disabled={
                  loading ||
                  cartLoading ||
                  !cartItems.length
                }
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <QrCode2 />
                  )
                }
                sx={{
                  mt: 2,

                  py: 1.6,

                  borderRadius: 2.5,

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

                {loading
                  ? "Creating Order..."
                  : `Continue to Scan & Pay ₹${grandTotal.toLocaleString(
                      "en-IN"
                    )}`}

              </Button>


              {/* SECURITY */}

              <Stack
                direction="row"
                spacing={0.8}
                justifyContent="center"
                alignItems="center"
                sx={{
                  mt: 1.5,
                }}
              >

                <LockOutlined
                  sx={{
                    fontSize: 16,

                    color:
                      "text.secondary",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Your order details are
                  securely processed.
                </Typography>

              </Stack>

            </CardContent>

          </Card>

        </Box>

      </Container>

    </Box>

  );

};

export default Checkout;