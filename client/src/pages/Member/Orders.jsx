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

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD ORDERS
  ===================================================== */

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getMyOrders();

      console.log("MY ORDERS:", data);

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
          minHeight: "45vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          m: 0,
          p: 0,
          boxSizing: "border-box",
          backgroundColor: "#F5F7FA",
        }}
      >
        <CircularProgress
          color="success"
          size={24}
          thickness={4}
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
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          m: 0,
          p: {
            xs: "12px 8px",
            sm: "20px 14px",
          },
          boxSizing: "border-box",
          backgroundColor: "#F5F7FA",
          overflowX: "hidden",
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "560px",
            borderRadius: 0,
            border: "1px solid #DDE7DE",
            backgroundColor: "#FFFFFF",
            boxShadow: "none",
            boxSizing: "border-box",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              px: {
                xs: 1.5,
                sm: 3,
              },
              py: {
                xs: 2,
                sm: 3,
              },

              "&:last-child": {
                pb: {
                  xs: 2,
                  sm: 3,
                },
              },
            }}
          >
            {/* ICON */}

            <Box
              sx={{
                width: {
                  xs: 48,
                  sm: 58,
                },
                height: {
                  xs: 48,
                  sm: 58,
                },
                mx: "auto",
                borderRadius: 0,
                backgroundColor: "#E8F5E9",
                color: "#2E7D32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBag
                sx={{
                  fontSize: {
                    xs: 26,
                    sm: 32,
                  },
                }}
              />
            </Box>

            {/* TITLE */}

            <Typography
              sx={{
                mt: 1.25,
                fontSize: {
                  xs: "15px",
                  sm: "18px",
                },
                lineHeight: 1.3,
                fontWeight: 700,
                color: "#292929",
              }}
            >
              You Have No Orders Yet
            </Typography>

            {/* MESSAGE */}

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.6,
                lineHeight: 1.45,
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                },
                maxWidth: 450,
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
                xs: 0.75,
                sm: 1,
              }}
              justifyContent="center"
              sx={{
                mt: {
                  xs: 1.5,
                  sm: 2,
                },
              }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<ShoppingCart />}
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
                    xs: 34,
                    sm: 38,
                  },
                  px: 2,
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                  },
                }}
              >
                Shop Now
              </Button>

              <Button
                variant="outlined"
                color="success"
                startIcon={<ArrowBack />}
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
                    xs: 34,
                    sm: 38,
                  },
                  px: 2,
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: {
                    xs: "10px",
                    sm: "12px",
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
        m: 0,
        p: 0,
        backgroundColor: "#F5F7FA",
        boxSizing: "border-box",
        overflowX: "hidden",
        borderRadius: 0,

        "& .MuiCard-root": {
          borderRadius: "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius: "0 !important",
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
          m: {
            xs: 0,
            md: "0 auto",
          },
          p: {
            xs: "8px",
            sm: "12px",
            md: "16px 8px 24px",
          },
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            m: 0,
            p: 0,
            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              m: 0,
              p: 0,
              fontSize: {
                xs: "18px",
                sm: "22px",
                md: "26px",
              },
              lineHeight: 1.25,
              fontWeight: 700,
              color: "#292929",
            }}
          >
            My Orders
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.25,
              fontSize: {
                xs: "9px",
                sm: "11px",
                md: "12px",
              },
              lineHeight: 1.4,
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
            m: 0,
            p: 0,
            boxSizing: "border-box",
            overflowX: "hidden",

            "& > *": {
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiCard-root": {
              borderRadius: "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius: "0 !important",
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
            m: 0,
            mt: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },
            p: 0,
            boxSizing: "border-box",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling:
              "touch",

            "& > *": {
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiCard-root": {
              borderRadius: "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius: "0 !important",
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