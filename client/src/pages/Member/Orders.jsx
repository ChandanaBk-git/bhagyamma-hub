import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  ShoppingBag,
  ShoppingCart,
  ArrowBack,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMyOrders } from "../../services/order.service";

import OrdersSummary from "../../components/members/orders/OrdersSummary";
import OrdersTable from "../../components/members/orders/OrdersTable";


const Orders = () => {

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     LOAD ORDERS
  ===================================================== */

  useEffect(() => {
    loadOrders();
  }, []);


  const loadOrders = async () => {

    try {

      setLoading(true);

      const data =
        await getMyOrders();

      console.log(
        "MY ORDERS:",
        data
      );

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load orders:",
        error
      );

      setOrders([]);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <Box
        sx={{
          width: "100%",

          minHeight: "60vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          margin: 0,

          padding: 0,

          boxSizing:
            "border-box",
        }}
      >

        <CircularProgress
          color="success"
          size={28}
        />

      </Box>
    );

  }


  /* =====================================================
     EMPTY ORDERS
  ===================================================== */

  if (orders.length === 0) {

    return (

      <Box
        sx={{
          width: "100%",

          minHeight: "70vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          margin: 0,

          padding: {
            xs: "20px 8px",
            sm: "30px 14px",
          },

          boxSizing:
            "border-box",

          backgroundColor:
            "#F5F7FA",

          overflowX:
            "hidden",
        }}
      >

        <Card
          elevation={0}
          sx={{
            width: "100%",

            maxWidth: "650px",

            borderRadius:
              "0 !important",

            border:
              "1px solid #DDE7DE",

            backgroundColor:
              "#FFFFFF",

            boxShadow:
              "none",

            boxSizing:
              "border-box",
          }}
        >

          <CardContent
            sx={{
              textAlign:
                "center",

              px: {
                xs: 2,
                sm: 5,
              },

              py: {
                xs: 3,
                sm: 5,
              },

              "&:last-child": {
                pb: {
                  xs: 3,
                  sm: 5,
                },
              },
            }}
          >

            {/* ICON */}

            <Box
              sx={{
                width: {
                  xs: 65,
                  sm: 85,
                },

                height: {
                  xs: 65,
                  sm: 85,
                },

                mx: "auto",

                borderRadius:
                  "50%",

                backgroundColor:
                  "#E8F5E9",

                color:
                  "#2E7D32",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <ShoppingBag
                sx={{
                  fontSize: {
                    xs: 34,
                    sm: 44,
                  },
                }}
              />

            </Box>


            {/* TITLE */}

            <Typography
              sx={{
                mt: {
                  xs: 2,
                  sm: 3,
                },

                fontSize: {
                  xs: "18px",
                  sm: "23px",
                },

                lineHeight: 1.3,

                fontWeight: 800,
              }}
            >
              You Have No Orders Yet
            </Typography>


            {/* MESSAGE */}

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,

                lineHeight: 1.6,

                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                maxWidth: 500,

                mx: "auto",
              }}
            >
              You haven't placed any
              orders yet. Explore our
              products and place your
              first order when you're
              ready.
            </Typography>


            {/* BUTTONS */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}

              spacing={{
                xs: 1,
                sm: 1.5,
              }}

              justifyContent="center"

              sx={{
                mt: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >

              <Button
                variant="contained"

                color="success"

                startIcon={
                  <ShoppingCart />
                }

                onClick={() =>
                  navigate(
                    "/member/products"
                  )
                }

                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  minHeight: {
                    xs: 40,
                    sm: 46,
                  },

                  px: 3,

                  borderRadius:
                    "0 !important",

                  textTransform:
                    "none",

                  fontWeight: 800,

                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                  },
                }}
              >
                Shop Now
              </Button>


              <Button
                variant="outlined"

                color="success"

                startIcon={
                  <ArrowBack />
                }

                onClick={() =>
                  navigate(
                    "/member/dashboard"
                  )
                }

                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  minHeight: {
                    xs: 40,
                    sm: 46,
                  },

                  px: 3,

                  borderRadius:
                    "0 !important",

                  textTransform:
                    "none",

                  fontWeight: 700,

                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                  },
                }}
              >
                Back to Dashboard
              </Button>

            </Stack>

          </CardContent>

        </Card>

      </Box>

    );
  }


  /* =====================================================
     ORDERS EXIST
  ===================================================== */

  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: "100%",

        minWidth: 0,

        minHeight: "100vh",

        margin: 0,

        padding: 0,

        backgroundColor:
          "#F5F7FA",

        boxSizing:
          "border-box",

        overflowX:
          "hidden",

        borderRadius:
          "0 !important",

        /* Remove outer rounded MUI containers */

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
        },
      }}
    >

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1400px",
          },

          minWidth: 0,

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing:
            "border-box",

          overflowX:
            "hidden",

          borderRadius:
            "0 !important",
        }}
      >

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            margin: 0,

            padding: 0,

            mb: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        >

          <Typography
            component="h1"
            sx={{
              margin: 0,

              padding: 0,

              fontSize: {
                xs: "20px",
                sm: "25px",
                md: "30px",
              },

              lineHeight: {
                xs: "25px",
                sm: "31px",
                md: "36px",
              },

              fontWeight: 800,

              color:
                "#292929",
            }}
          >
            My Orders
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 0.4,

              fontSize: {
                xs: "11px",
                sm: "13px",
                md: "14px",
              },

              lineHeight: 1.5,
            }}
          >
            View and track your orders
            from Bhagyamma Hub.
          </Typography>

        </Box>


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            minWidth: 0,

            margin: 0,

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "hidden",

            borderRadius:
              "0 !important",

            "& > *": {
              maxWidth:
                "100%",

              boxSizing:
                "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
            },
          }}
        >

          <OrdersSummary
            orders={orders}
          />

        </Box>


        {/* =================================================
            ORDERS LIST / TABLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            minWidth: 0,

            margin: 0,

            marginTop: {
              xs: "10px",
              sm: "14px",
              md: "18px",
            },

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "auto",

            overflowY:
              "hidden",

            borderRadius:
              "0 !important",

            "& > *": {
              maxWidth:
                "100%",

              boxSizing:
                "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
            },
          }}
        >

          <OrdersTable
            orders={orders}
          />

        </Box>

      </Box>

    </Box>

  );

};


export default Orders;