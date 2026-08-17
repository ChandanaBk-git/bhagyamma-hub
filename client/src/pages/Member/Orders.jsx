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
          minHeight: "60vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <CircularProgress
          color="success"
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

          alignItems: "center",

          justifyContent: "center",

          px: {
            xs: 1,
            sm: 2,
          },

          py: {
            xs: 3,
            sm: 5,
          },

          boxSizing: "border-box",
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",

            maxWidth: 650,

            borderRadius: {
              xs: 2.5,
              sm: 4,
            },

            border:
              "1px solid #DDE7DE",

            backgroundColor:
              "#FFFFFF",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",

              px: {
                xs: 2.5,
                sm: 5,
              },

              py: {
                xs: 4,
                sm: 6,
              },
            }}
          >
            {/* ICON */}

            <Box
              sx={{
                width: {
                  xs: 75,
                  sm: 95,
                },

                height: {
                  xs: 75,
                  sm: 95,
                },

                mx: "auto",

                borderRadius: "50%",

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
                    xs: 38,
                    sm: 50,
                  },
                }}
              />
            </Box>

            {/* TITLE */}

            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                mt: 3,

                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem",
                },
              }}
            >
              You Have No Orders Yet
            </Typography>

            {/* MESSAGE */}

            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,

                lineHeight: 1.7,

                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
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
              spacing={1.5}
              justifyContent="center"
              sx={{
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={
                  <ShoppingCart />
                }
                onClick={() =>
                  navigate(
                    "/member/products"
                  )
                }
                sx={{
                  minHeight: 46,

                  px: 3,

                  borderRadius: 2,

                  textTransform:
                    "none",

                  fontWeight: 800,

                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              >
                Shop Now
              </Button>

              <Button
                variant="outlined"
                color="success"
                size="large"
                startIcon={
                  <ArrowBack />
                }
                onClick={() =>
                  navigate(
                    "/member/dashboard"
                  )
                }
                sx={{
                  minHeight: 46,

                  px: 3,

                  borderRadius: 2,

                  textTransform:
                    "none",

                  fontWeight: 700,

                  width: {
                    xs: "100%",
                    sm: "auto",
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

        minHeight: "100vh",

        bgcolor: "#F5F7FA",

        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Box
        sx={{
          mb: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.2rem",
            },
          }}
        >
          My Orders
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.5,

            fontSize: {
              xs: "0.82rem",
              sm: "0.95rem",
            },
          }}
        >
          View and track your orders
          from Bhagyamma Hub.
        </Typography>
      </Box>

      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <OrdersSummary
        orders={orders}
      />

      {/* =================================================
          ORDER TABLE / LIST
      ================================================= */}

      <OrdersTable
        orders={orders}
      />
    </Box>
  );
};

export default Orders;