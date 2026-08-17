import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  Inventory2Outlined,
  Phone,
  Search,
  ShoppingBag,
} from "@mui/icons-material";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getMyOrders,
  getGuestOrdersByMobile,
} from "../../services/order.service";


const Orders = () => {

  const navigate =
    useNavigate();


  /* ======================================================
     AUTHENTICATION
  ====================================================== */

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isLoggedIn =
    Boolean(token);


  /* ======================================================
     STATE
  ====================================================== */

  const [mobile, setMobile] =
    useState("");

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);

  const [error, setError] =
    useState("");


  /* ======================================================
     LOGGED-IN MEMBER
     
     Fetch automatically.
  ====================================================== */

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }

    loadMemberOrders();

  }, [
    isLoggedIn,
  ]);


  /* ======================================================
     LOAD MEMBER ORDERS
  ====================================================== */

  const loadMemberOrders =
    async () => {

      try {

        setLoading(true);

        setError("");

        const result =
          await getMyOrders();


        setOrders(
          Array.isArray(result)
            ? result
            : []
        );

        setSearched(true);

      } catch (err) {

        console.error(
          "Member orders error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load your orders."
        );

      } finally {

        setLoading(false);

      }

    };


  /* ======================================================
     GUEST SEARCH
  ====================================================== */

  const handleGuestSearch =
    async () => {

      const normalizedMobile =
        mobile.replace(
          /\D/g,
          ""
        );


      if (
        normalizedMobile.length !==
        10 ||
        !/^[6-9]\d{9}$/.test(
          normalizedMobile
        )
      ) {

        setError(
          "Please enter a valid 10-digit mobile number."
        );

        return;
      }


      try {

        setLoading(true);

        setError("");

        setSearched(true);


        const result =
          await getGuestOrdersByMobile(
            normalizedMobile
          );


        setOrders(
          Array.isArray(result)
            ? result
            : []
        );


      } catch (err) {

        console.error(
          "Guest orders error:",
          err
        );

        setOrders([]);

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to find orders for this mobile number."
        );

      } finally {

        setLoading(false);

      }

    };


  /* ======================================================
     FORMAT DATE
  ====================================================== */

  const formatDate =
    (date) => {

      if (!date) {
        return "-";
      }

      try {

        return new Date(
          date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

      } catch {

        return "-";

      }

    };


  /* ======================================================
     STATUS COLOR
  ====================================================== */

  const getStatusColor =
    (status) => {

      switch (
        String(
          status || ""
        ).toUpperCase()
      ) {

        case "DELIVERED":
          return "success";

        case "CANCELLED":
          return "error";

        case "SHIPPED":
        case "OUT_FOR_DELIVERY":
          return "info";

        case "CONFIRMED":
        case "PACKED":
          return "primary";

        default:
          return "warning";

      }

    };


  /* ======================================================
     PAYMENT STATUS
  ====================================================== */

  const getPaymentColor =
    (status) => {

      switch (
        String(
          status || ""
        ).toUpperCase()
      ) {

        case "PAID":
          return "success";

        case "FAILED":
        case "REFUNDED":
          return "error";

        default:
          return "warning";

      }

    };


  /* ======================================================
     ORDER DETAILS
  ====================================================== */

  const handleOrderClick =
    (order) => {

      if (!order?._id) {
        return;
      }

      /*
       * Member order details are protected
       * by JWT.
       *
       * Guest order details currently use
       * the guest mobile search result.
       */

      navigate(
        `/orders/${order._id}`
      );

    };


  /* ======================================================
     HEADER
  ====================================================== */

  return (

    <Box
      sx={{
        minHeight:
          "100vh",

        backgroundColor:
          "#F5F7FA",

        px: {
          xs: 1.5,
          sm: 3,
        },

        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >

      <Box
        sx={{
          width:
            "100%",

          maxWidth:
            900,

          mx:
            "auto",
        }}
      >

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <Box
          sx={{
            textAlign:
              "center",

            mb: 3,
          }}
        >

          <Box
            sx={{
              width: 65,

              height: 65,

              mx: "auto",

              borderRadius:
                "50%",

              backgroundColor:
                "#E8F5E9",

              color:
                "#2E7D32",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              mb: 1.5,
            }}
          >

            <ShoppingBag
              sx={{
                fontSize:
                  34,
              }}
            />

          </Box>


          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2.2rem",
              },
            }}
          >
            My Orders
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 0.7,

              fontSize: {
                xs: "0.82rem",
                sm: "0.95rem",
              },
            }}
          >
            View and track your
            previous Bhagyamma Hub
            orders.
          </Typography>

        </Box>


        {/* ==================================================
            LOGGED-IN USER
        ================================================== */}

        {isLoggedIn ? (

          <Card
            elevation={0}
            sx={{
              borderRadius:
                3,

              border:
                "1px solid #DDE7DE",

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

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >

                <Inventory2Outlined
                  sx={{
                    color:
                      "#2E7D32",
                  }}
                />

                <Box>

                  <Typography
                    fontWeight={800}
                  >
                    Your Previous Orders
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your orders are loaded
                    automatically from your
                    account.
                  </Typography>

                </Box>

              </Stack>

            </CardContent>

          </Card>

        ) : (

          /* ==================================================
             GUEST USER
          ================================================== */

          <Card
            elevation={0}
            sx={{
              borderRadius:
                3,

              border:
                "1px solid #DDE7DE",

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
                fontWeight={800}
                sx={{
                  mb: 0.7,
                }}
              >
                Find Your Previous Orders
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  lineHeight:
                    1.6,
                }}
              >
                Enter the mobile number
                you used while placing
                your guest order.
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
              >

                <TextField
                  fullWidth
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(event) => {

                    const value =
                      event.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          10
                        );

                    setMobile(
                      value
                    );

                    setError("");

                  }}
                  inputProps={{
                    maxLength: 10,
                    inputMode:
                      "numeric",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                      >
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />


                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={
                    handleGuestSearch
                  }
                  disabled={
                    loading
                  }
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <Search />
                    )
                  }
                  sx={{
                    minWidth: {
                      xs:
                        "100%",
                      sm:
                        180,
                    },

                    minHeight:
                      56,

                    borderRadius:
                      2,

                    textTransform:
                      "none",

                    fontWeight:
                      800,
                  }}
                >
                  {loading
                    ? "Searching..."
                    : "View Orders"}
                </Button>

              </Stack>

            </CardContent>

          </Card>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 2,

              borderRadius:
                2,
            }}
          >
            {error}
          </Alert>

        )}


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading &&
          isLoggedIn && (

            <Box
              sx={{
                display:
                  "flex",

                justifyContent:
                  "center",

                py: 5,
              }}
            >

              <CircularProgress
                color="success"
              />

            </Box>

          )}


        {/* ==================================================
            NO ORDERS
        ================================================== */}

        {!loading &&
          searched &&
          orders.length === 0 &&
          !error && (

            <Card
              elevation={0}
              sx={{
                borderRadius:
                  3,

                border:
                  "1px solid #E0E0E0",

                textAlign:
                  "center",
              }}
            >

              <CardContent
                sx={{
                  py: 5,
                }}
              >

                <ShoppingBag
                  sx={{
                    fontSize:
                      65,

                    color:
                      "#9E9E9E",

                    mb: 1.5,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  No Orders Found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.8,
                  }}
                >
                  {isLoggedIn
                    ? "You have not placed any orders yet."
                    : "No orders were found for this mobile number."}
                </Typography>

                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    navigate(
                      isLoggedIn
                        ? "/member/products"
                        : "/products"
                    )
                  }
                  sx={{
                    mt: 2,

                    textTransform:
                      "none",

                    fontWeight:
                      700,
                  }}
                >
                  Continue Shopping
                </Button>

              </CardContent>

            </Card>

          )}


        {/* ==================================================
            ORDERS LIST
        ================================================== */}

        {!loading &&
          orders.length > 0 && (

            <Stack
              spacing={2}
            >

              <Typography
                fontWeight={800}
                sx={{
                  px: 0.5,
                }}
              >
                {orders.length}{" "}
                {orders.length === 1
                  ? "Order"
                  : "Orders"}{" "}
                Found
              </Typography>


              {orders.map(
                (order) => (

                  <Card
                    key={
                      order._id
                    }
                    elevation={0}
                    sx={{
                      borderRadius:
                        3,

                      border:
                        "1px solid #DDE7DE",

                      transition:
                        "0.2s",

                      "&:hover": {
                        boxShadow:
                          "0 6px 20px rgba(0,0,0,.07)",
                      },
                    }}
                  >

                    <CardContent
                      sx={{
                        p: {
                          xs: 2,
                          sm: 2.5,
                        },
                      }}
                    >

                      {/* ORDER TOP */}

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        justifyContent=
                          "space-between"
                        alignItems={{
                          xs:
                            "flex-start",
                          sm:
                            "center",
                        }}
                        spacing={1}
                      >

                        <Box>

                          <Typography
                            fontWeight={900}
                          >
                            {order.orderNumber ||
                              "Order"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.4,
                            }}
                          >
                            {formatDate(
                              order.createdAt ||
                              order.placedAt
                            )}
                          </Typography>

                        </Box>


                        <Chip
                          size="small"
                          label={
                            order.status ||
                            "PLACED"
                          }
                          color={
                            getStatusColor(
                              order.status
                            )
                          }
                          sx={{
                            fontWeight:
                              700,
                          }}
                        />

                      </Stack>


                      <Divider
                        sx={{
                          my: 2,
                        }}
                      />


                      {/* ORDER DETAILS */}

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={{
                          xs: 1.5,
                          sm: 4,
                        }}
                      >

                        <Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Amount
                          </Typography>

                          <Typography
                            fontWeight={900}
                            color="#2E7D32"
                          >
                            ₹
                            {Number(
                              order.finalAmount ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>

                        </Box>


                        <Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Payment
                          </Typography>

                          <Box>

                            <Chip
                              size="small"
                              label={
                                order.paymentStatus ||
                                "PENDING"
                              }
                              color={
                                getPaymentColor(
                                  order.paymentStatus
                                )
                              }
                              sx={{
                                mt:
                                  0.3,

                                fontWeight:
                                  700,
                              }}
                            />

                          </Box>

                        </Box>


                        <Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Order Type
                          </Typography>

                          <Typography
                            fontWeight={700}
                          >
                            {order.orderType ||
                              "MEMBER"}
                          </Typography>

                        </Box>

                      </Stack>


                      {/* ITEMS */}

                      {order.items &&
                        order.items.length >
                          0 && (

                          <Box
                            sx={{
                              mt: 2,
                            }}
                          >

                            <Typography
                              variant="body2"
                              fontWeight={700}
                            >
                              {order.items.length}{" "}
                              {order.items.length ===
                              1
                                ? "item"
                                : "items"}
                            </Typography>

                          </Box>

                        )}


                      {/* VIEW DETAILS */}

                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        endIcon={
                          <ArrowForward />
                        }
                        onClick={() =>
                          handleOrderClick(
                            order
                          )
                        }
                        sx={{
                          mt: 2,

                          minHeight:
                            44,

                          borderRadius:
                            2,

                          textTransform:
                            "none",

                          fontWeight:
                            800,
                        }}
                      >
                        View Order Details
                      </Button>

                    </CardContent>

                  </Card>

                )
              )}

            </Stack>

          )}

      </Box>

    </Box>

  );
};

export default Orders;