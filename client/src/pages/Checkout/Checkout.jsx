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

import {
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import {
  createOrder,
} from "../../services/order.service";


/* =========================================================
   DELIVERY CONFIGURATION
========================================================= */

/*
 * IMPORTANT:
 *
 * Delivery charge is ALWAYS ₹50
 * when the cart contains products.
 *
 * There is NO FREE DELIVERY THRESHOLD.
 *
 * Selling points are calculated separately
 * from PRODUCT SUBTOTAL ONLY.
 */

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
  const product =
    getProduct(item);

  return (
    item?.productName ||
    product?.productName ||
    product?.name ||
    "Product"
  );
};


const getProductPrice = (item) => {
  const product =
    getProduct(item);

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
   CHECKOUT COMPONENT
========================================================= */

const Checkout = () => {

  const navigate =
    useNavigate();


  /* =======================================================
     CART CONTEXT
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
     
     PRODUCT PRICE × QUANTITY ONLY.
     
     DELIVERY IS NOT INCLUDED.
  ======================================================= */

  const subtotal = useMemo(
    () => {

      return items.reduce(
        (
          total,
          item
        ) => {

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

    },
    [items]
  );


  /* =======================================================
     DELIVERY CHARGE
     
     FIXED ₹50 FOR EVERY NON-EMPTY CART.
     
     NO FREE DELIVERY THRESHOLD.
  ======================================================= */

  const deliveryCharge =
    useMemo(
      () => {

        if (
          items.length === 0 ||
          subtotal <= 0
        ) {
          return 0;
        }

        return DELIVERY_CHARGE;

      },
      [
        items.length,
        subtotal,
      ]
    );


  /* =======================================================
     FINAL AMOUNT
     
     CUSTOMER PAYMENT =
     
     PRODUCT SUBTOTAL + DELIVERY
  ======================================================= */

  const finalAmount =
    useMemo(
      () => {

        return (
          subtotal +
          deliveryCharge
        );

      },
      [
        subtotal,
        deliveryCharge,
      ]
    );


  /* =======================================================
     FORM
  ======================================================= */

  const [
    form,
    setForm,
  ] = useState({

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

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  /* =======================================================
     LOAD USER INFORMATION
  ======================================================= */

  useEffect(
    () => {

      const loadUser =
        async () => {

          try {

            const savedUser =
              JSON.parse(
                localStorage.getItem(
                  "user"
                ) ||
                  sessionStorage.getItem(
                    "user"
                  ) ||
                  "{}"
              );


            setForm(
              (previous) => ({

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

              })
            );

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

    },
    []
  );


  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setForm(
        (previous) => ({

          ...previous,

          [name]:
            value,

        })
      );


      setError("");

    };


  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm =
    () => {

      if (
        !form.name.trim()
      ) {

        return "Please enter your full name.";

      }


      const mobile =
        form.mobile.replace(
          /\D/g,
          ""
        );


      if (
        mobile.length !== 10
      ) {

        return "Please enter a valid 10-digit mobile number.";

      }


      if (
        !form.address.trim()
      ) {

        return "Please enter your delivery address.";

      }


      if (
        !form.city.trim()
      ) {

        return "Please enter your city.";

      }


      if (
        !form.state.trim()
      ) {

        return "Please enter your state.";

      }


      const pincode =
        form.pincode.replace(
          /\D/g,
          ""
        );


      if (
        pincode.length !== 6
      ) {

        return "Please enter a valid 6-digit pincode.";

      }


      return "";

    };


  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const handlePlaceOrder =
    async () => {

      if (
        placingOrder
      ) {
        return;
      }


      setError("");

      setSuccess("");


      /* ===================================================
         CART VALIDATION
      =================================================== */

      if (
        !items.length
      ) {

        setError(
          "Your cart is empty. Please add products before checkout."
        );

        return;

      }


      if (
        subtotal <= 0
      ) {

        setError(
          "Unable to calculate the cart amount. Please return to the cart and try again."
        );

        return;

      }


      /* ===================================================
         FORM VALIDATION
      =================================================== */

      const validationError =
        validateForm();


      if (
        validationError
      ) {

        setError(
          validationError
        );

        return;

      }


      try {

        setPlacingOrder(
          true
        );


        /* =================================================
           SAVE CART SNAPSHOT

           DO NOT CLEAR CART HERE.

           Cart must remain available until payment
           is completed/verified according to your
           payment flow.
        ================================================= */

        const cartSnapshot = {

          items:
            items.map(
              (item) => ({

                productId:
                  item?.product?._id ||
                  item?.productId?._id ||
                  item?.productId ||
                  item?._id,

                productName:
                  getProductName(
                    item
                  ),

                price:
                  getProductPrice(
                    item
                  ),

                quantity:
                  getQuantity(
                    item
                  ),

              })
            ),

          /*
           * PRODUCT AMOUNT ONLY
           */
          subtotal,

          /*
           * FIXED ₹50
           */
          deliveryCharge,

          /*
           * CUSTOMER PAYS THIS
           */
          finalAmount,

        };


        sessionStorage.setItem(
          "bhagyamma_pending_cart",
          JSON.stringify(
            cartSnapshot
          )
        );


        /* =================================================
           ORDER ITEMS
        ================================================= */

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


        /* =================================================
           ORDER PAYLOAD
           
           NO SELLING POINTS.
           
           Backend calculates SP independently
           from PRODUCT SUBTOTAL.
        ================================================= */

        const orderPayload = {

          customerName:
            form.name.trim(),

          customerMobile:
            form.mobile.replace(
              /\D/g,
              ""
            ),

          customerEmail:
            form.email
              .trim()
              .toLowerCase(),

          paymentMethod:
            "PHONEPE",

          items:
            orderItems,

          deliveryDetails: {

            name:
              form.name.trim(),

            mobile:
              form.mobile.replace(
                /\D/g,
                ""
              ),

            address:
              form.address.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            pincode:
              form.pincode.replace(
                /\D/g,
                ""
              ),

          },


          /*
           * IMPORTANT:
           *
           * Product subtotal
           */
          subtotal,


          /*
           * ALWAYS ₹50 for a non-empty order
           */
          deliveryCharge,


          /*
           * Customer payment amount
           */
          finalAmount,

        };


        console.log(
          "======================================"
        );

        console.log(
          "CREATING ORDER"
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


        /* =================================================
           CREATE ORDER
        ================================================= */

        const response =
          await createOrder(
            orderPayload
          );


        console.log(
          "CREATE ORDER RESPONSE:",
          response
        );


        /* =================================================
           GET CREATED ORDER
        ================================================= */

        const order =
          response?.data?.data ||
          response?.data ||
          response;


        if (
          !order
        ) {

          throw new Error(
            "Order was created but order details were not returned."
          );

        }


        /* =================================================
           ORDER ID
        ================================================= */

        const orderId =
          order?._id ||
          order?.id;


        if (
          !orderId
        ) {

          throw new Error(
            "Order ID was not returned by the server."
          );

        }


        /* =================================================
           ORDER NUMBER
        ================================================= */

        const orderNumber =
          order?.orderNumber ||
          "";


        /* =================================================
           SERVER SUBTOTAL
        ================================================= */

        const serverSubtotal =
          getNumber(
            order?.subtotal
          ) ||
          subtotal;


        /* =================================================
           SERVER DELIVERY
           
           If backend returns ₹50, use it.
           
           If backend does not return it,
           fallback to ₹50.
        ================================================= */

        const serverDelivery =
          getNumber(
            order?.deliveryCharge
          ) > 0
            ? getNumber(
                order?.deliveryCharge
              )
            : deliveryCharge;


        /* =================================================
           SERVER FINAL AMOUNT
        ================================================= */

        let serverFinalAmount =
          getNumber(
            order?.finalAmount
          );


        /*
         * If backend doesn't return a valid final
         * amount, calculate:
         *
         * subtotal + delivery
         */
        if (
          serverFinalAmount <= 0
        ) {

          serverFinalAmount =
            serverSubtotal +
            serverDelivery;

        }


        /* =================================================
           SAFETY CALCULATION
        ================================================= */

        const expectedAmount =
          serverSubtotal +
          serverDelivery;


        /*
         * Never allow scanner amount to be
         * lower than subtotal + delivery.
         */
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


        /* =================================================
           PAYMENT DATA
           
           NO SELLING POINTS.
           
           Scanner gets ONLY payment information.
        ================================================= */

        const paymentData = {

          orderId,

          orderNumber,

          /*
           * Product subtotal
           */
          subtotal:
            serverSubtotal,

          /*
           * Delivery
           */
          deliveryCharge:
            serverDelivery,

          /*
           * Final customer payment
           */
          finalAmount:
            serverFinalAmount,

          /*
           * Compatibility
           */
          amount:
            serverFinalAmount,

          paymentMethod:
            order?.paymentMethod ||
            "PHONEPE",

          customerName:
            order?.customerName ||
            form.name,

          customerMobile:
            order?.customerMobile ||
            form.mobile,

          customerEmail:
            order?.customerEmail ||
            form.email,

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


        /* =================================================
           SAVE PENDING PAYMENT
        ================================================= */

        sessionStorage.setItem(
          "bhagyamma_pending_payment",
          JSON.stringify(
            paymentData
          )
        );


        setSuccess(
          "Order created successfully. Opening payment scanner..."
        );


        /* =================================================
           GO TO PAYMENT SCANNER
        ================================================= */

        navigate(
          "/payment/scan",
          {
            state:
              paymentData,
          }
        );

      } catch (
        err
      ) {

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


        setError(
          message
        );

      } finally {

        setPlacingOrder(
          false
        );

      }

    };


  /* =======================================================
     BACK TO CART
     
     IMPORTANT:
     NEVER CLEAR CART HERE.
  ======================================================= */

  const handleBackToCart =
    () => {

      navigate(
        "/member/cart"
      );

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
          minHeight:
            "70vh",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

        }}
      >

        <CircularProgress />

      </Box>

    );

  }


  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (
    !items.length
  ) {

    return (

      <Box
        sx={{
          minHeight:
            "80vh",

          bgcolor:
            "#F5F7F6",

          py: 5,

        }}
      >

        <Container
          maxWidth="sm"
        >

          <Card
            elevation={2}
            sx={{
              borderRadius:
                4,

              textAlign:
                "center",

            }}
          >

            <CardContent
              sx={{
                p: 5,
              }}
            >

              <ShoppingBagOutlined
                sx={{
                  fontSize:
                    70,

                  color:
                    "#9E9E9E",

                  mb: 2,

                }}
              />


              <Typography
                variant="h5"
                fontWeight={800}
              >
                Your Cart is Empty
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  mb: 3,
                }}
              >
                Add products to your cart
                before proceeding to
                checkout.
              </Typography>


              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/products"
                  )
                }
                sx={{
                  textTransform:
                    "none",

                  borderRadius:
                    2,

                  px: 4,

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
        minHeight:
          "100vh",

        bgcolor:
          "#F5F7F6",

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

        {/* ================================================
            BACK
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


        {/* ================================================
            TITLE
        ================================================= */}

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
            },

            mb: 0.5,

          }}
        >
          Checkout
        </Typography>


        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
          }}
        >
          Enter your delivery details
          and continue to payment.
        </Typography>


        {/* ================================================
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


        {/* ================================================
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


        {/* ================================================
            DELIVERY DETAILS
        ================================================= */}

        <Card
          elevation={1}
          sx={{
            borderRadius:
              3,

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
                mb: 2,
              }}
            >
              Delivery Information
            </Typography>


            <Grid
              container
              spacing={2}
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
                  }}
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
                  minRows={3}
                  label="Delivery Address"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              {/* CITY */}

              <Grid
                size={{
                  xs: 12,
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
                />

              </Grid>


              {/* STATE */}

              <Grid
                size={{
                  xs: 12,
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
                />

              </Grid>


              {/* PINCODE */}

              <Grid
                size={{
                  xs: 12,
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
                  }}
                />

              </Grid>

            </Grid>

          </CardContent>

        </Card>


        {/* ================================================
            ORDER SUMMARY
        ================================================= */}

        <Card
          elevation={1}
          sx={{
            borderRadius:
              3,
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
                mb: 2,
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

                        gap: 2,

                      }}
                    >

                      <Box>

                        <Typography
                          fontWeight={600}
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


                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          each
                        </Typography>

                      </Box>


                      <Typography
                        fontWeight={700}
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

                mb: 1.5,

              }}
            >

              <Typography>
                Subtotal
              </Typography>


              <Typography
                fontWeight={600}
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

                mb: 2,

              }}
            >

              <Typography>
                Delivery Charges
              </Typography>


              <Typography
                fontWeight={700}
                sx={{
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
                mb: 2,
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

                mb: 3,

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
                  fontSize:
                    "1.35rem",

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


            {/* ==========================================
                PAYMENT INFO
            =========================================== */}

            <Box
              sx={{
                p: 2,

                bgcolor:
                  "#EAF7EA",

                border:
                  "1px solid #A5D6A7",

                borderRadius:
                  2.5,

                mb: 2,

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
                  }}
                />


                <Box>

                  <Typography
                    fontWeight={800}
                    sx={{
                      color:
                        "#24752D",
                    }}
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
                    Your order will be
                    created and you will
                    then be taken to the
                    payment scanner.
                  </Typography>

                </Box>

              </Stack>

            </Box>


            {/* ==========================================
                PAYMENT BUTTON
            =========================================== */}

            <Button
              fullWidth
              variant="contained"
              size="large"
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
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <QrCode2 />
                )
              }
              sx={{
                py: 1.5,

                borderRadius:
                  2.5,

                textTransform:
                  "none",

                fontWeight:
                  800,

                bgcolor:
                  "#4CAF50",

                "&:hover": {
                  bgcolor:
                    "#388E3C",
                },

              }}
            >

              {placingOrder

                ? "Creating Order..."

                : `Continue to Scan & Pay ₹${finalAmount.toLocaleString(
                    "en-IN"
                  )}`

              }

            </Button>


            {/* ==========================================
                SECURITY
            =========================================== */}

            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 1.5,
              }}
            >

              <LockOutlined
                sx={{
                  fontSize:
                    16,

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

      </Container>

    </Box>

  );

};


export default Checkout;