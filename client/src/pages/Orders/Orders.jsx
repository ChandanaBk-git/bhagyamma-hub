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
  Phone,
  Search,
  ShoppingBag,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyOrders,
  getGuestOrdersByMobile,
} from "../../services/order.service";

import { retryPhonePePayment } from "../../services/payment.service";

const Orders = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isLoggedIn = Boolean(token);

  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [retryingOrderId, setRetryingOrderId] = useState("");
  const [paymentErrors, setPaymentErrors] = useState({});

  useEffect(() => {
    if (!isLoggedIn) return;
    loadMemberOrders();
  }, [isLoggedIn]);

  const loadMemberOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMyOrders();
      setOrders(Array.isArray(result) ? result : []);
      setSearched(true);
    } catch (err) {
      console.error("Member orders error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSearch = async () => {
    const normalizedMobile = mobile.replace(/\D/g, "");

    if (
      normalizedMobile.length !== 10 ||
      !/^[6-9]\d{9}$/.test(normalizedMobile)
    ) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const result = await getGuestOrdersByMobile(normalizedMobile);
      setOrders(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Guest orders error:", err);
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

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const getStatusColor = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "DELIVERED":
      case "READY_FOR_DISPATCH":
      case "PACKED":
        return "success";
      case "CANCELLED":
        return "error";
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "info";
      case "PACKING":
      case "CONFIRMED":
        return "primary";
      case "PLACED":
      default:
        return "warning";
    }
  };

  const getStatusLabel = (status) => {
    const map = {
      READY_FOR_DISPATCH: "READY FOR DISPATCH",
      OUT_FOR_DELIVERY: "OUT FOR DELIVERY",
      PACKING: "PACKING",
      PACKED: "PACKED",
      CONFIRMED: "CONFIRMED",
      SHIPPED: "SHIPPED",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
      PLACED: "PLACED",
    };
    return map[String(status || "").toUpperCase()] || "PLACED";
  };

  const getPaymentColor = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "PAID":
        return "success";
      case "FAILED":
      case "REFUNDED":
        return "error";
      default:
        return "warning";
    }
  };

  const handleRetryPayment = async (order) => {
    const orderId = order?._id || order?.orderId;
    if (!orderId) return;

    try {
      setRetryingOrderId(String(orderId));
      setPaymentErrors((previous) => ({ ...previous, [String(orderId)]: "" }));

      const payment = await retryPhonePePayment(orderId);
      if (!payment?.redirectUrl) {
        throw new Error("PhonePe checkout URL was not returned.");
      }

      window.location.href = payment.redirectUrl;
    } catch (err) {
      setPaymentErrors((previous) => ({
        ...previous,
        [String(orderId)]:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to start payment. Please try again.",
      }));
    } finally {
      setRetryingOrderId("");
    }
  };

  const handleOrderClick = (order) => {
    if (!order?._id) {
      console.error("Order ID is missing:", order);
      return;
    }
    navigate(`/orders/${order._id}`, { state: { order } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 880, mx: "auto" }}>
        {/* COMPACT PAGE HEADER */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "#E8F5E9",
                color: "#2E7D32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ fontSize: { xs: "1.15rem", sm: "1.35rem" }, lineHeight: 1.2 }}
              >
                My Orders
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.76rem" }}>
                View and track your Bhagyamma Hub orders
              </Typography>
            </Box>
          </Stack>

          {!loading && orders.length > 0 && (
            <Chip
              size="small"
              label={`${orders.length} ${orders.length === 1 ? "Order" : "Orders"}`}
              sx={{ fontWeight: 700, bgcolor: "#E8F5E9", color: "#1B5E20" }}
            />
          )}
        </Stack>

        {/* COMPACT GUEST SEARCH */}
        {!isLoggedIn && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #DDE7DE",
              mb: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter 10-digit mobile number for guest orders"
                  value={mobile}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(value);
                    setError("");
                  }}
                  inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleGuestSearch}
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Search fontSize="small" />
                    )
                  }
                  sx={{
                    minWidth: { xs: "100%", sm: 155 },
                    height: 40,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    boxShadow: "none",
                  }}
                >
                  {loading ? "Searching..." : "Find Orders"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* ERROR */}
        {error && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: 1.5, py: 0.5 }}>
            {error}
          </Alert>
        )}

        {/* LOADING */}
        {loading && isLoggedIn && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="success" size={28} />
          </Box>
        )}

        {/* NO ORDERS */}
        {!loading && searched && orders.length === 0 && !error && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #E0E0E0",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <ShoppingBag sx={{ fontSize: 42, color: "#9E9E9E", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={800}>
                No Orders Found
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.8rem", mt: 0.4 }}>
                {isLoggedIn
                  ? "You have not placed any orders yet."
                  : "No orders were found for this mobile number."}
              </Typography>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => navigate(isLoggedIn ? "/member/products" : "/products")}
                sx={{ mt: 1.5, textTransform: "none", fontWeight: 700 }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        )}

        {/* COMPACT ORDERS LIST */}
        {!loading && orders.length > 0 && (
          <Stack spacing={1.25}>
            {orders.map((order) => {
              const idKey = String(order._id || order.orderId);
              const showPayNow =
                String(order.paymentStatus || "PENDING").toUpperCase() !== "PAID" &&
                String(order.status || "").toUpperCase() !== "CANCELLED";

              return (
                <Card
                  key={order._id}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #DDE7DE",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "#2E7D32" },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 1.5, sm: 1.75 },
                      "&:last-child": { pb: { xs: 1.5, sm: 1.75 } },
                    }}
                  >
                    {/* TOP ROW: ORDER NO + DATE + STATUS */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={1}
                      flexWrap="wrap"
                    >
                      <Stack direction="row" spacing={1.25} alignItems="baseline" flexWrap="wrap">
                        <Typography fontWeight={800} sx={{ fontSize: "0.92rem" }}>
                          {order.orderNumber || "Order"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {formatDate(order.createdAt || order.placedAt)}
                        </Typography>
                        {order.items?.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </Typography>
                        )}
                      </Stack>

                      <Chip
                        size="small"
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700 }}
                      />
                    </Stack>

                    <Divider sx={{ my: 1.1 }} />

                    {/* BOTTOM ROW: META + ACTIONS */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "stretch", sm: "center" }}
                      gap={1.25}
                    >
                      <Stack
                        direction="row"
                        spacing={{ xs: 2, sm: 3 }}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                            Amount
                          </Typography>
                          <Typography fontWeight={800} color="#2E7D32" sx={{ fontSize: "0.92rem" }}>
                            ₹{Number(order.finalAmount || 0).toLocaleString("en-IN")}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                            Payment
                          </Typography>
                          <Chip
                            size="small"
                            label={String(order.paymentStatus || "PENDING").toUpperCase()}
                            color={getPaymentColor(order.paymentStatus)}
                            sx={{ mt: 0.25, height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                          />
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                            Type
                          </Typography>
                          <Typography fontWeight={700} sx={{ fontSize: "0.78rem" }}>
                            {order.orderType || "MEMBER"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {showPayNow && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRetryPayment(order)}
                            disabled={retryingOrderId === idKey}
                            sx={{
                              minWidth: 96,
                              height: 32,
                              px: 1.75,
                              borderRadius: 1.5,
                              bgcolor: "#5F259F",
                              color: "#FFFFFF",
                              fontWeight: 700,
                              fontSize: "0.76rem",
                              textTransform: "none",
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#4B1C80", boxShadow: "none" },
                            }}
                          >
                            {retryingOrderId === idKey ? (
                              <CircularProgress size={15} color="inherit" />
                            ) : (
                              "Pay Now"
                            )}
                          </Button>
                        )}

                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          endIcon={<ArrowForward sx={{ fontSize: 15 }} />}
                          onClick={() => handleOrderClick(order)}
                          sx={{
                            height: 32,
                            px: 1.75,
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.76rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Stack>

                    {paymentErrors[idKey] && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.75 }}
                      >
                        {paymentErrors[idKey]}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Orders;