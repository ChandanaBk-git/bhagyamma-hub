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

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "35vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F7FA",
        }}
      >
        <CircularProgress color="success" size={24} thickness={4} />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "45vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: "12px 8px", sm: "16px 12px" },
          boxSizing: "border-box",
          backgroundColor: "#F5F7FA",
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "480px",
            borderRadius: 0,
            border: "1px solid #DDE7DE",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 2, sm: 2.5 },
              "&:last-child": { pb: { xs: 2, sm: 2.5 } },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                mx: "auto",
                backgroundColor: "#E8F5E9",
                color: "#2E7D32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBag sx={{ fontSize: 24 }} />
            </Box>

            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 700,
                color: "#292929",
              }}
            >
              You Have No Orders Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.4,
                fontSize: { xs: "10px", sm: "11px" },
                maxWidth: 400,
                mx: "auto",
              }}
            >
              Explore our products and place your first order when you're ready.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={0.75}
              justifyContent="center"
              sx={{ mt: 1.5 }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<ShoppingCart fontSize="small" />}
                onClick={() => navigate("/member/products")}
                sx={{
                  minHeight: 32,
                  px: 2,
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "11px",
                }}
              >
                Shop Now
              </Button>

              <Button
                variant="outlined"
                color="success"
                startIcon={<ArrowBack fontSize="small" />}
                onClick={() => navigate("/member/dashboard")}
                sx={{
                  minHeight: 32,
                  px: 2,
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "11px",
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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        m: 0,
        p: 0,
        backgroundColor: "#F5F7FA",
        boxSizing: "border-box",
        overflowX: "hidden",
        "& .MuiCard-root, & .MuiPaper-root": {
          borderRadius: "0 !important",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "1400px" },
          minWidth: 0,
          m: { xs: 0, md: "0 auto" },
          p: { xs: "8px", sm: "10px", md: "12px 10px 18px" },
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* COMPACT HEADER */}
        <Box sx={{ mb: 1 }}>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontSize: { xs: "16px", sm: "19px", md: "22px" },
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#292929",
            }}
          >
            My Orders
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.2,
              fontSize: { xs: "9px", sm: "11px" },
            }}
          >
            View and track your orders from Bhagyamma Hub.
          </Typography>
        </Box>

        {/* COMPACT ORDER SUMMARY */}
        <OrdersSummary orders={orders} />

        {/* ORDERS TABLE */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            mt: 1,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <OrdersTable orders={orders} />
        </Box>
      </Box>
    </Box>
  );
};

export default Orders;