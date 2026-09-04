import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  LockOutlined,
  QrCode2,
  ShoppingBagOutlined,
} from "@mui/icons-material";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import {
  createOrder,
} from "../../services/order.service";


/* =========================================================
   DELIVERY CONFIGURATION
========================================================= */

const DELIVERY_CHARGE = 50;


/* =========================================================
   HELPERS
========================================================= */

const getNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};


const getCartItems = (cart) => {
  if (!cart) {
    return [];
  }

  if (Array.isArray(cart.items)) {
    return cart.items;
  }

  if (Array.isArray(cart.cartItems)) {
    return cart.cartItems;
  }

  if (Array.isArray(cart.products)) {
    return cart.products;
  }

  if (Array.isArray(cart)) {
    return cart;
  }

  return [];
};


const getProduct = (item) => {
  if (!item) {
    return {};
  }

  return (
    item.product ||
    item.productId ||
    item.productDetails ||
    {}
  );
};


const getProductName = (item) => {
  const product = getProduct(item);

  return (
    item?.productName ||
    product?.productName ||
    product?.name ||
    "Product"
  );
};


const getProductPrice = (item) => {
  const product = getProduct(item);

  return getNumber(
    item?.price ??
      item?.productPrice ??
      product?.price ??
      product?.sellingPrice ??
      0
  );
};


const getQuantity = (item) => {
  return Math.max(
    1,
    getNumber(
      item?.quantity ??
        item?.qty ??
        item?.count ??
        1
    )
  );
};


/* =========================================================
   COMPACT TEXT FIELD STYLE
========================================================= */

const compactFieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: {
      xs: 40,
      sm: 42,
    },

    height: {
      xs: 40,
      sm: 42,
    },

    borderRadius: 0,

    backgroundColor: "#fff",

    "& fieldset": {
      borderColor: "#C9CEC9",
    },

    "&:hover fieldset": {
      borderColor: "#8DB58F",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2E7D32",
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    padding: {
      xs: "9px 12px",
      sm: "10px 12px",
    },

    fontSize: {
      xs: "0.68rem",
      sm: "0.72rem",
    },

    lineHeight: 1.2,
  },

  "& .MuiInputLabel-root": {
    fontSize: {
      xs: "0.68rem",
      sm: "0.72rem",
    },
  },

  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    fontSize: {
      xs: "0.62rem",
      sm: "0.66rem",
    },
  },
};


const compactMultilineSx = {
  ...compactFieldSx,

  "& .MuiOutlinedInput-root": {
    minHeight: {
      xs: 62,
      sm: 68,
    },

    height: "auto",

    borderRadius: 0,

    alignItems: "flex-start",

    backgroundColor: "#fff",

    "& fieldset": {
      borderColor: "#C9CEC9",
    },

    "&:hover fieldset": {
      borderColor: "#8DB58F",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2E7D32",
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    padding: {
      xs: "11px 12px",
      sm: "12px",
    },

    fontSize: {
      xs: "0.68rem",
      sm: "0.72rem",
    },

    lineHeight: 1.35,
  },
};


/* =========================================================
   CHECKOUT COMPONENT
========================================================= */

const Checkout = () => {
  const navigate = useNavigate();


  /* =======================================================
     CART
  ======================================================= */

  const {
    cart,
    loading: cartLoading,
  } = useCart();


  /* =======================================================
     CART ITEMS
  ======================================================= */

  const items = useMemo(
    () => getCartItems(cart),
    [cart]
  );


  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const price =
          getProductPrice(item);

        const quantity =
          getQuantity(item);

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [items]);


  /* =======================================================
     DELIVERY CHARGE
     
     ALWAYS ₹50 FOR NON-EMPTY CART
  ======================================================= */

  const deliveryCharge = useMemo(() => {
    if (
      items.length === 0 ||
      subtotal <= 0
    ) {
      return 0;
    }

    return DELIVERY_CHARGE;
  }, [
    items.length,
    subtotal,
  ]);


  /* =======================================================
     FINAL AMOUNT
  ======================================================= */

  const finalAmount = useMemo(() => {
    return (
      subtotal +
      deliveryCharge
    );
  }, [
    subtotal,
    deliveryCharge,
  ]);


  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  });


  /* =======================================================
     STATES
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =======================================================
     LOAD USER INFORMATION
  ======================================================= */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser =
          JSON.parse(
            localStorage.getItem("user") ||
              sessionStorage.getItem("user") ||
              "{}"
          );

        setForm((previous) => ({
          ...previous,

          name:
            savedUser?.name ||
            savedUser?.fullName ||
            previous.name,

          mobile:
            savedUser?.mobile ||
            savedUser?.phone ||
            savedUser?.mobileNumber ||
            previous.mobile,

          email:
            savedUser?.email ||
            previous.email,

          address:
            savedUser?.address ||
            previous.address,

          city:
            savedUser?.city ||
            previous.city,

          state:
            savedUser?.state ||
            "Karnataka",

          pincode:
            savedUser?.pincode ||
            savedUser?.pinCode ||
            previous.pincode,
        }));
      } catch (err) {
        console.log(
          "USER DETAILS LOAD ERROR:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    let newValue = value;

    /* MOBILE */

    if (name === "mobile") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }


    /* PINCODE */

    if (name === "pincode") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }


    setForm((previous) => ({
      ...previous,
      [name]: newValue,
    }));

    setError("");
  };


  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {

    if (!form.name.trim()) {
      return "Please enter your full name.";
    }


    const mobile =
      form.mobile.replace(
        /\D/g,
        ""
      );


    if (
      mobile.length !== 10 ||
      !/^[6-9]\d{9}$/.test(
        mobile
      )
    ) {
      return "Please enter a valid 10-digit mobile number.";
    }


    if (!form.address.trim()) {
      return "Please enter your delivery address.";
    }


    if (!form.city.trim()) {
      return "Please enter your city.";
    }


    if (!form.state.trim()) {
      return "Please enter your state.";
    }


    const pincode =
      form.pincode.replace(
        /\D/g,
        ""
      );


    if (pincode.length !== 6) {
      return "Please enter a valid 6-digit pincode.";
    }


    return "";
  };


  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const handlePlaceOrder = async () => {

    if (placingOrder) {
      return;
    }


    setError("");
    setSuccess("");


    /* =====================================================
       CART VALIDATION
    ===================================================== */

    if (!items.length) {
      setError(
        "Your cart is empty. Please add products before checkout."
      );

      return;
    }


    if (subtotal <= 0) {
      setError(
        "Unable to calculate the cart amount. Please return to the cart and try again."
      );

      return;
    }


    /* =====================================================
       FORM VALIDATION
    ===================================================== */

    const validationError =
      validateForm();


    if (validationError) {
      setError(
        validationError
      );

      return;
    }


    try {

      setPlacingOrder(true);


      /* ===================================================
         NORMALIZED CUSTOMER DATA
      =================================================== */

      const customerName =
        form.name.trim();

      const customerMobile =
        form.mobile.replace(
          /\D/g,
          ""
        );

      const customerEmail =
        form.email
          .trim()
          .toLowerCase();

      const customerAddress =
        form.address.trim();

      const customerCity =
        form.city.trim();

      const customerState =
        form.state.trim();

      const customerPincode =
        form.pincode.replace(
          /\D/g,
          ""
        );


      /* ===================================================
         SAVE CART SNAPSHOT
         
         DO NOT CLEAR CART HERE.
      =================================================== */

      const cartSnapshot = {
        items: items.map(
          (item) => ({
            productId:
              item?.product?._id ||
              item?.productId?._id ||
              item?.productId ||
              item?._id,

            productName:
              getProductName(item),

            price:
              getProductPrice(item),

            quantity:
              getQuantity(item),
          })
        ),

        subtotal,

        deliveryCharge,

        finalAmount,
      };


      sessionStorage.setItem(
        "bhagyamma_pending_cart",
        JSON.stringify(
          cartSnapshot
        )
      );


      /* ===================================================
         ORDER ITEMS
      =================================================== */

      const orderItems =
        items.map(
          (item) => ({
            productId:
              item?.product?._id ||
              item?.productId?._id ||
              item?.productId ||
              item?._id,

            quantity:
              getQuantity(item),
          })
        );


      /* ===================================================
         ORDER PAYLOAD
         
         IMPORTANT:
         
         Backend expects:
         
         name
         mobile
         email
         address
         city
         state
         pincode
         
         AT TOP LEVEL.
         
         We also keep customerName/customerMobile/
         customerEmail and deliveryDetails for
         compatibility.
      =================================================== */

      const orderPayload = {

        /* ================================================
           REQUIRED TOP-LEVEL CUSTOMER FIELDS
        ================================================= */

        name:
          customerName,

        mobile:
          customerMobile,

        email:
          customerEmail,

        address:
          customerAddress,

        city:
          customerCity,

        state:
          customerState,

        pincode:
          customerPincode,


        /* ================================================
           COMPATIBILITY CUSTOMER FIELDS
        ================================================= */

        customerName:
          customerName,

        customerMobile:
          customerMobile,

        customerEmail:
          customerEmail,


        /* ================================================
           PAYMENT METHOD
        ================================================= */

        paymentMethod:
          "PHONEPE",


        /* ================================================
           ITEMS
        ================================================= */

        items:
          orderItems,


        /* ================================================
           DELIVERY DETAILS
        ================================================= */

        deliveryDetails: {

          name:
            customerName,

          mobile:
            customerMobile,

          address:
            customerAddress,

          city:
            customerCity,

          state:
            customerState,

          pincode:
            customerPincode,

        },


        /* ================================================
           AMOUNTS
        ================================================= */

        subtotal,

        deliveryCharge,

        finalAmount,

      };


      console.log(
        "======================================"
      );

      console.log(
        "CREATING ORDER"
      );

      console.log(
        "CUSTOMER NAME:",
        orderPayload.name
      );

      console.log(
        "CUSTOMER MOBILE:",
        orderPayload.mobile
      );

      console.log(
        "PRODUCT SUBTOTAL:",
        subtotal
      );

      console.log(
        "DELIVERY CHARGE:",
        deliveryCharge
      );

      console.log(
        "FINAL PAYMENT AMOUNT:",
        finalAmount
      );

      console.log(
        "ORDER PAYLOAD:",
        orderPayload
      );

      console.log(
        "======================================"
      );


      /* ===================================================
         CREATE ORDER
      =================================================== */

      const response =
        await createOrder(
          orderPayload
        );


      console.log(
        "CREATE ORDER RESPONSE:",
        response
      );


      /* ===================================================
         GET CREATED ORDER
      =================================================== */

      const order =
        response?.data?.data ||
        response?.data ||
        response;


      if (!order) {
        throw new Error(
          "Order was created but order details were not returned."
        );
      }


      /* ===================================================
         ORDER ID
      =================================================== */

      const orderId =
        order?._id ||
        order?.id;


      if (!orderId) {
        throw new Error(
          "Order ID was not returned by the server."
        );
      }


      /* ===================================================
         ORDER NUMBER
      =================================================== */

      const orderNumber =
        order?.orderNumber ||
        "";


      /* ===================================================
         SERVER SUBTOTAL
      =================================================== */

      const serverSubtotal =
        getNumber(
          order?.subtotal
        ) ||
        subtotal;


      /* ===================================================
         SERVER DELIVERY
         
         FALLBACK = ₹50
      =================================================== */

      const serverDelivery =
        getNumber(
          order?.deliveryCharge
        ) > 0
          ? getNumber(
              order?.deliveryCharge
            )
          : deliveryCharge;


      /* ===================================================
         SERVER FINAL AMOUNT
      =================================================== */

      let serverFinalAmount =
        getNumber(
          order?.finalAmount
        );


      if (
        serverFinalAmount <= 0
      ) {
        serverFinalAmount =
          serverSubtotal +
          serverDelivery;
      }


      /* ===================================================
         SAFETY CHECK
      =================================================== */

      const expectedAmount =
        serverSubtotal +
        serverDelivery;


      if (
        serverFinalAmount <
        expectedAmount
      ) {
        serverFinalAmount =
          expectedAmount;
      }


      if (
        serverFinalAmount <= 0
      ) {
        throw new Error(
          "Invalid payment amount returned by the server."
        );
      }


      /* ===================================================
         PAYMENT DATA
         
         NO SELLING POINTS.
      =================================================== */

      const paymentData = {

        orderId,

        orderNumber,

        subtotal:
          serverSubtotal,

        deliveryCharge:
          serverDelivery,

        finalAmount:
          serverFinalAmount,

        amount:
          serverFinalAmount,

        paymentMethod:
          order?.paymentMethod ||
          "PHONEPE",

        customerName:
          order?.customerName ||
          order?.name ||
          customerName,

        customerMobile:
          order?.customerMobile ||
          order?.mobile ||
          customerMobile,

        customerEmail:
          order?.customerEmail ||
          order?.email ||
          customerEmail,

      };


      console.log(
        "======================================"
      );

      console.log(
        "PAYMENT SCANNER DATA"
      );

      console.log(
        paymentData
      );

      console.log(
        "PAYMENT AMOUNT:",
        serverFinalAmount
      );

      console.log(
        "======================================"
      );


      /* ===================================================
         SAVE PENDING PAYMENT
      =================================================== */

      sessionStorage.setItem(
        "bhagyamma_pending_payment",
        JSON.stringify(
          paymentData
        )
      );


      setSuccess(
        "Order created successfully. Opening payment scanner..."
      );


      /* ===================================================
         GO TO PAYMENT SCANNER
      =================================================== */

      navigate(
        "/payment/scan",
        {
          state:
            paymentData,
        }
      );

    } catch (err) {

      console.error(
        "======================================"
      );

      console.error(
        "CREATE ORDER ERROR:",
        err
      );

      console.error(
        "BACKEND RESPONSE:",
        err?.response?.data
      );

      console.error(
        "======================================"
      );


      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to create the order. Please try again.";


      setError(message);

    } finally {

      setPlacingOrder(
        false
      );

    }
  };


  /* =======================================================
     BACK TO CART
  ======================================================= */

const handleBackToCart = () => {
  navigate("/cart");
};


  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading ||
    cartLoading
  ) {

    return (
      <Box
        sx={{
          minHeight: "50vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={26}
          color="success"
        />
      </Box>
    );
  }


  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (!items.length) {

    return (
      <Box
        sx={{
          minHeight: "70vh",

          bgcolor: "#F5F7F6",

          py: 3,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            px: 1.5,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border:
                "1px solid #E1E6E2",

              borderRadius: 0,

              textAlign: "center",
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
              }}
            >
              <ShoppingBagOutlined
                sx={{
                  fontSize: 44,

                  color:
                    "#9E9E9E",

                  mb: 0.5,
                }}
              />

              <Typography
                sx={{
                  fontSize:
                    "1rem",

                  fontWeight:
                    800,
                }}
              >
                Your Cart is Empty
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,

                  mb: 1.5,

                  fontSize:
                    "0.62rem",

                  color:
                    "text.secondary",
                }}
              >
                Add products to your cart
                before proceeding to checkout.
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/products"
                  )
                }
                sx={{
                  minHeight: 34,

                  px: 2.5,

                  borderRadius: 0,

                  textTransform:
                    "none",

                  fontSize:
                    "0.65rem",

                  fontWeight:
                    700,
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
     MAIN PAGE
  ======================================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F5F7F6",

        py: {
          xs: 1,
          sm: 2,
          md: 2.5,
        },
      }}
    >

      <Container
        maxWidth="md"
        sx={{
          px: {
            xs: 1,
            sm: 1.5,
          },
        }}
      >

        {/* =================================================
            BACK TO CART
        ================================================= */}

        <Button
          variant="text"
          startIcon={
            <ArrowBack
              sx={{
                fontSize:
                  "13px !important",
              }}
            />
          }
          onClick={
            handleBackToCart
          }
          sx={{
            display:
              "inline-flex",

            minWidth:
              "auto",

            minHeight:
              24,

            height:
              24,

            p: 0,

            mb:
              0.5,

            backgroundColor:
              "transparent !important",

            color:
              "#2E7D32 !important",

            boxShadow:
              "none !important",

            borderRadius:
              "0 !important",

            textTransform:
              "none",

            fontSize:
              "0.6rem",

            lineHeight:
              1,

            fontWeight:
              700,

            "&:hover": {
              backgroundColor:
                "transparent !important",

              boxShadow:
                "none !important",
            },

            "& .MuiButton-startIcon": {
              marginRight:
                "3px",

              marginLeft:
                0,
            },
          }}
        >
          Back to Cart
        </Button>


        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            mb: 1.2,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.4rem",
              },

              lineHeight:
                1.15,

              fontWeight:
                900,

              color:
                "#222",
            }}
          >
            Checkout
          </Typography>

          <Typography
            sx={{
              mt: 0.2,

              fontSize: {
                xs: "0.58rem",
                sm: "0.66rem",
              },

              lineHeight:
                1.3,

              color:
                "text.secondary",
            }}
          >
            Enter your delivery details
            and continue to payment.
          </Typography>
        </Box>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 1,

              py: 0,

              px: 0.8,

              minHeight:
                32,

              borderRadius:
                0,

              fontSize:
                "0.6rem",

              "& .MuiAlert-icon": {
                fontSize:
                  16,

                py:
                  0.5,
              },

              "& .MuiAlert-message": {
                py:
                  0.6,
              },
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
              mb: 1,

              py: 0,

              px: 0.8,

              minHeight:
                32,

              borderRadius:
                0,

              fontSize:
                "0.6rem",

              "& .MuiAlert-icon": {
                fontSize:
                  16,

                py:
                  0.5,
              },

              "& .MuiAlert-message": {
                py:
                  0.6,
              },
            }}
          >
            {success}
          </Alert>
        )}


        {/* =================================================
            DELIVERY INFORMATION
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #DDE4DD",

            borderRadius:
              0,

            mb:
              1.2,

            backgroundColor:
              "#fff",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 1.2,
                sm: 1.6,
              },

              "&:last-child": {
                pb: {
                  xs: 1.2,
                  sm: 1.6,
                },
              },
            }}
          >

            <Typography
              sx={{
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.82rem",
                },

                fontWeight:
                  800,

                mb: {
                  xs: 0.9,
                  sm: 1.1,
                },
              }}
            >
              Delivery Information
            </Typography>


            <Grid
              container
              spacing={{
                xs: 0.8,
                sm: 1,
              }}
            >

              {/* NAME */}

              <Grid
                size={{
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  size="small"
                  sx={
                    compactFieldSx
                  }
                />
              </Grid>


              {/* MOBILE */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Mobile Number"
                  name="mobile"
                  value={
                    form.mobile
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    maxLength:
                      10,

                    inputMode:
                      "numeric",
                  }}
                  size="small"
                  sx={
                    compactFieldSx
                  }
                />
              </Grid>


              {/* EMAIL */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  size="small"
                  sx={
                    compactFieldSx
                  }
                />
              </Grid>


              {/* ADDRESS */}

              <Grid
                size={{
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  label="Delivery Address"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  size="small"
                  sx={
                    compactMultilineSx
                  }
                />
              </Grid>


              {/* CITY */}

              <Grid
                size={{
                  xs: 4,
                  sm: 4,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="City"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  size="small"
                  sx={
                    compactFieldSx
                  }
                />
              </Grid>


              {/* STATE */}

              <Grid
                size={{
                  xs: 4,
                  sm: 4,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="State"
                  name="state"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                  size="small"
                  sx={
                    compactFieldSx
                  }
                />
              </Grid>


              {/* PINCODE */}

              <Grid
                size={{
                  xs: 4,
                  sm: 4,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Pincode"
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  inputProps={{
                    maxLength:
                      6,

                    inputMode:
                      "numeric",
                  }}
                  size="small"
                  sx={
                    compactFieldSx
                  }
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
            border:
              "1px solid #DDE4DD",

            borderRadius:
              0,

            backgroundColor:
              "#fff",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 1.2,
                sm: 1.6,
              },

              "&:last-child": {
                pb: {
                  xs: 1.2,
                  sm: 1.6,
                },
              },
            }}
          >

            <Typography
              sx={{
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.82rem",
                },

                fontWeight:
                  800,

                mb:
                  0.7,
              }}
            >
              Order Summary
            </Typography>


            <Divider
              sx={{
                mb:
                  0.9,
              }}
            />


            {/* PRODUCTS */}

            <Stack
              spacing={
                0.65
              }
            >

              {items.map(
                (
                  item,
                  index
                ) => {

                  const name =
                    getProductName(
                      item
                    );

                  const price =
                    getProductPrice(
                      item
                    );

                  const quantity =
                    getQuantity(
                      item
                    );

                  const itemTotal =
                    price *
                    quantity;


                  return (
                    <Box
                      key={
                        item?._id ||
                        item?.productId?._id ||
                        item?.productId ||
                        item?.product?._id ||
                        index
                      }
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "flex-start",

                        gap:
                          1,
                      }}
                    >

                      <Box
                        sx={{
                          minWidth:
                            0,
                        }}
                      >

                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.61rem",
                              sm: "0.68rem",
                            },

                            fontWeight:
                              700,

                            lineHeight:
                              1.25,

                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",

                            maxWidth: {
                              xs: 260,
                              sm: 400,
                            },
                          }}
                        >
                          {name}
                        </Typography>


                        <Typography
                          sx={{
                            mt:
                              0.1,

                            fontSize: {
                              xs: "0.51rem",
                              sm: "0.57rem",
                            },

                            color:
                              "text.secondary",
                          }}
                        >
                          Qty: {quantity} × ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </Typography>

                      </Box>


                      <Typography
                        sx={{
                          flexShrink:
                            0,

                          fontSize: {
                            xs: "0.62rem",
                            sm: "0.68rem",
                          },

                          fontWeight:
                            800,
                        }}
                      >
                        ₹
                        {itemTotal.toLocaleString(
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
                my:
                  0.9,
              }}
            />


            {/* SUBTOTAL */}

            <Box
              sx={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                mb:
                  0.5,
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.67rem",
                  },

                  color:
                    "text.secondary",
                }}
              >
                Subtotal
              </Typography>


              <Typography
                sx={{
                  fontSize: {
                    xs: "0.62rem",
                    sm: "0.68rem",
                  },

                  fontWeight:
                    700,
                }}
              >
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

                mb:
                  0.8,
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.67rem",
                  },

                  color:
                    "text.secondary",
                }}
              >
                Delivery Charges
              </Typography>


              <Typography
                sx={{
                  fontSize: {
                    xs: "0.62rem",
                    sm: "0.68rem",
                  },

                  fontWeight:
                    700,

                  color:
                    "#2E7D32",
                }}
              >
                ₹
                {deliveryCharge.toLocaleString(
                  "en-IN"
                )}
              </Typography>

            </Box>


            <Divider
              sx={{
                mb:
                  0.8,
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

                mb:
                  0.9,
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.68rem",
                    sm: "0.75rem",
                  },

                  fontWeight:
                    900,
                }}
              >
                Grand Total
              </Typography>


              <Typography
                sx={{
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.1rem",
                  },

                  fontWeight:
                    900,

                  color:
                    "#2E7D32",
                }}
              >
                ₹
                {finalAmount.toLocaleString(
                  "en-IN"
                )}
              </Typography>

            </Box>


            {/* =================================================
                PAYMENT INFORMATION
            ================================================= */}

            <Box
              sx={{
                p: {
                  xs: 0.8,
                  sm: 1,
                },

                bgcolor:
                  "#EAF7EA",

                border:
                  "1px solid #A5D6A7",

                borderRadius:
                  0,

                mb:
                  0.8,
              }}
            >

              <Stack
                direction="row"
                spacing={
                  0.7
                }
                alignItems="center"
              >

                <QrCode2
                  sx={{
                    color:
                      "#2E7D32",

                    fontSize: {
                      xs: 18,
                      sm: 20,
                    },
                  }}
                />


                <Box>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.6rem",
                        sm: "0.68rem",
                      },

                      fontWeight:
                        800,

                      color:
                        "#24752D",

                      lineHeight:
                        1.2,
                    }}
                  >
                    UPI Scan & Pay
                  </Typography>


                  <Typography
                    sx={{
                      mt:
                        0.15,

                      fontSize: {
                        xs: "0.49rem",
                        sm: "0.55rem",
                      },

                      lineHeight:
                        1.3,

                      color:
                        "text.secondary",
                    }}
                  >
                    Order will be created
                    before opening the
                    payment scanner.
                  </Typography>

                </Box>

              </Stack>

            </Box>


            {/* =================================================
                PAYMENT BUTTON
            ================================================= */}

            <Button
              fullWidth
              variant="contained"
              disabled={
                placingOrder ||
                !items.length ||
                finalAmount <= 0
              }
              onClick={
                handlePlaceOrder
              }
              startIcon={
                placingOrder ? (
                  <CircularProgress
                    size={14}
                    color="inherit"
                  />
                ) : (
                  <QrCode2
                    sx={{
                      fontSize:
                        "17px !important",
                    }}
                  />
                )
              }
              sx={{
                minHeight: {
                  xs: 36,
                  sm: 40,
                },

                height: {
                  xs: 36,
                  sm: 40,
                },

                p:
                  0,

                borderRadius:
                  "0 !important",

                textTransform:
                  "none",

                fontWeight:
                  800,

                fontSize: {
                  xs: "0.59rem",
                  sm: "0.68rem",
                },

                bgcolor:
                  "#4CAF50",

                boxShadow:
                  "none",

                "&:hover": {
                  bgcolor:
                    "#388E3C",

                  boxShadow:
                    "none",
                },
              }}
            >
              {placingOrder
                ? "Creating Order..."
                : `Continue to Scan & Pay ₹${finalAmount.toLocaleString(
                    "en-IN"
                  )}`}
            </Button>


            {/* =================================================
                SECURITY
            ================================================= */}

            <Stack
              direction="row"
              spacing={
                0.3
              }
              justifyContent="center"
              alignItems="center"
              sx={{
                mt:
                  0.6,
              }}
            >

              <LockOutlined
                sx={{
                  fontSize:
                    12,

                  color:
                    "text.secondary",
                }}
              />


              <Typography
                sx={{
                  fontSize:
                    "0.48rem",

                  color:
                    "text.secondary",
                }}
              >
                Securely processed
              </Typography>

            </Stack>

          </CardContent>
        </Card>

      </Container>
    </Box>
  );
};


export default Checkout;