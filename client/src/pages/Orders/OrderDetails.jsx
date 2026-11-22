import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

import {
  ArrowBack,
  Inventory2Outlined,
  ShoppingBag,
  LocalShippingOutlined,
  Refresh,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getOrderById,
  getGuestOrdersByMobile,
} from "../../services/order.service";

import { retryPhonePePayment } from "../../services/payment.service";

const REFRESH_INTERVAL_MS = 15000;

const formatAmount = (amount) => {
  const value = Number(amount);
  if (
    amount === null ||
    amount === undefined ||
    amount === "" ||
    !Number.isFinite(value)
  ) {
    return "0.00";
  }

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "—";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const cleanStatus = (value) => String(value || "").trim().toUpperCase();

const prettyStatus = (value) =>
  String(value || "PENDING")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getProductFromItem = (item) => {
  if (item?.productId && typeof item.productId === "object") return item.productId;
  if (item?.product && typeof item.product === "object") return item.product;
  return {};
};

const getItemName = (item) => {
  const product = getProductFromItem(item);
  const savedName = String(item?.productName || "").trim();
  if (savedName && savedName.toLowerCase() !== "product") return savedName;
  return product.productName || product.name || item?.name || "Product details unavailable";
};

const getItemImage = (item) => {
  const product = getProductFromItem(item);
  const images = product.images;
  if (Array.isArray(images)) return images[0] || "";
  return typeof images === "string" ? images : "";
};

const getUnitPrice = (item) => {
  const product = getProductFromItem(item);
  const savedPrice = Number(item?.price);
  const productPrice = Number(product?.price);
  if (Number.isFinite(savedPrice) && savedPrice > 0) return savedPrice;
  if (Number.isFinite(productPrice) && productPrice >= 0) return productPrice;
  return Number.isFinite(savedPrice) && savedPrice >= 0 ? savedPrice : 0;
};

const getLineTotal = (item) => {
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const savedTotal = Number(item?.total);
  return Number.isFinite(savedTotal) && savedTotal > 0
    ? savedTotal
    : getUnitPrice(item) * quantity;
};

const DELIVERY_STEPS = [
  { key: "PLACED", label: "Order placed", description: "Order received." },
  { key: "CONFIRMED", label: "Confirmed", description: "Order confirmed." },
  { key: "PACKING", label: "Packing", description: "Being packed." },
  { key: "PACKED", label: "Packed", description: "Package ready." },
  { key: "READY_FOR_DISPATCH", label: "Ready to ship", description: "At dispatch." },
  { key: "SHIPPED", label: "Shipped", description: "Dispatched." },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery", description: "On the way." },
  { key: "DELIVERED", label: "Delivered", description: "Order delivered." },
];

const statusRank = (status) => {
  const normalized = cleanStatus(status);
  const index = DELIVERY_STEPS.findIndex((step) => step.key === normalized);
  return index < 0 ? 0 : index;
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const backToOrders = location.pathname.startsWith("/member/")
    ? "/member/orders"
    : "/orders";

  const orderId = params.orderId || params.id || params._id;
  const initialOrder = location.state?.order || null;

  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [refreshError, setRefreshError] = useState("");
  const [retryingPayment, setRetryingPayment] = useState(false);
  const [paymentRetryError, setPaymentRetryError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token") || ""
      : "";

  const fetchLatestOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setRefreshError("");

      if (token) {
        const latest = await getOrderById(orderId);
        if (latest && String(latest._id || latest.orderId) === String(orderId)) {
          setOrder(latest);
        }
      } else {
        const mobile =
          order?.customerMobile ||
          order?.deliveryDetails?.mobile ||
          initialOrder?.customerMobile ||
          initialOrder?.deliveryDetails?.mobile;

        if (mobile) {
          const guestOrders = await getGuestOrdersByMobile(mobile);
          const latest = (Array.isArray(guestOrders) ? guestOrders : []).find(
            (entry) => String(entry._id || entry.orderId) === String(orderId)
          );
          if (latest) setOrder(latest);
        }
      }
    } catch (error) {
      console.error("Refresh order details failed:", error);
      setRefreshError("Could not refresh tracking right now.");
    } finally {
      setLoading(false);
    }
  }, [
    orderId,
    token,
    order?.customerMobile,
    order?.deliveryDetails?.mobile,
    initialOrder,
  ]);

  useEffect(() => {
    if (initialOrder) setOrder(initialOrder);
    fetchLatestOrder();
    const intervalId = window.setInterval(fetchLatestOrder, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [fetchLatestOrder, initialOrder]);

  const items = Array.isArray(order?.items) ? order.items : [];
  const paymentStatus = cleanStatus(order?.paymentStatus || "PENDING");
  const normalizedOrderStatus = cleanStatus(order?.status || "PLACED");
  const packagingTracking = order?.packagingTracking || {};
  const packagingStatus = cleanStatus(packagingTracking.status || "UNASSIGNED");

  const paymentColor =
    paymentStatus === "PAID"
      ? "success"
      : ["FAILED", "CANCELLED", "REFUNDED"].includes(paymentStatus)
        ? "error"
        : "warning";

  const customerName = order?.customerName || order?.deliveryDetails?.name || "";
  const customerMobile = order?.customerMobile || order?.deliveryDetails?.mobile || "";
  const address = order?.deliveryDetails || {};
  const activeRank = useMemo(() => statusRank(normalizedOrderStatus), [normalizedOrderStatus]);
  const isCancelled = normalizedOrderStatus === "CANCELLED";

  const handleRetryPayment = async () => {
    const currentOrderId = order?._id || order?.orderId;
    if (!currentOrderId) {
      setPaymentRetryError("Order ID is missing.");
      return;
    }

    try {
      setRetryingPayment(true);
      setPaymentRetryError("");
      const payment = await retryPhonePePayment(currentOrderId);
      if (!payment?.redirectUrl) {
        throw new Error("PhonePe checkout URL was not returned.");
      }
      window.location.href = payment.redirectUrl;
    } catch (error) {
      setPaymentRetryError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start payment. Please try again."
      );
    } finally {
      setRetryingPayment(false);
    }
  };

  if (loading && !order) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <LinearProgress color="success" />
        <Typography sx={{ mt: 1.5, fontSize: "0.85rem" }} textAlign="center">
          Loading order details…
        </Typography>
      </Container>
    );
  }

  if (!order || String(order._id || order.orderId) !== String(orderId)) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Inventory2Outlined sx={{ fontSize: 44, color: "success.main", mb: 1 }} />
            <Typography variant="h6" fontWeight={800}>
              Order details unavailable
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: "0.85rem" }}>
              Return to My Orders and select your order again.
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<ArrowBack />}
              sx={{ mt: 2 }}
              onClick={() => navigate(backToOrders)}
            >
              Back to My Orders
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const timestampFields = {
    PLACED: order.placedAt || order.createdAt,
    CONFIRMED: order.confirmedAt,
    PACKING: packagingTracking.packingStartedAt || order.packingAt,
    PACKED: packagingTracking.packedAt || order.packedAt,
    READY_FOR_DISPATCH: packagingTracking.readyForDispatchAt || order.readyForDispatchAt,
    SHIPPED: order.shippedAt,
    OUT_FOR_DELIVERY: order.outForDeliveryAt,
    DELIVERED: order.deliveredAt,
  };

  const hasDeliveryInfo =
    customerName || customerMobile || address.address || address.city || address.pincode;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        py: { xs: 1.5, sm: 2.5 },
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2.5 } }}>
        {/* TOP BAR */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.25 }}
        >
          <Button
            size="small"
            startIcon={<ArrowBack fontSize="small" />}
            onClick={() => navigate(backToOrders)}
            sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8rem" }}
          >
            Back to My Orders
          </Button>

          <Button
            size="small"
            startIcon={<Refresh fontSize="small" />}
            onClick={fetchLatestOrder}
            sx={{ textTransform: "none", fontSize: "0.78rem" }}
          >
            Refresh
          </Button>
        </Stack>

        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid #DDE7DE",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 1.75, sm: 2.5 } }}>
            {/* COMPACT BILL HEADER */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1.25}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <ShoppingBag sx={{ fontSize: 28, color: "success.main", flexShrink: 0 }} />
                <Box>
                  <Typography fontWeight={800} sx={{ fontSize: { xs: "1rem", sm: "1.15rem" }, lineHeight: 1.2 }}>
                    Bhagyamma Hub — Order Bill
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Order No: <strong>{order.orderNumber || order._id || order.orderId}</strong> •{" "}
                    {formatDate(order.createdAt || order.placedAt)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={`Payment: ${prettyStatus(paymentStatus)}`}
                  color={paymentColor}
                  sx={{ height: 24, fontSize: "0.7rem", fontWeight: 700 }}
                />

                {paymentStatus !== "PAID" && !isCancelled && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleRetryPayment}
                    disabled={retryingPayment}
                    sx={{
                      height: 28,
                      px: 1.75,
                      borderRadius: 1.5,
                      bgcolor: "#5F259F",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "0.74rem",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#4B1C80", boxShadow: "none" },
                    }}
                  >
                    {retryingPayment ? <CircularProgress size={14} color="inherit" /> : "Pay Now"}
                  </Button>
                )}
              </Stack>
            </Stack>

            {refreshError && (
              <Alert severity="info" sx={{ mt: 1.25, py: 0, fontSize: "0.76rem" }}>
                {refreshError}
              </Alert>
            )}

            {paymentRetryError && (
              <Alert severity="error" sx={{ mt: 1.25, py: 0, fontSize: "0.76rem" }}>
                {paymentRetryError}
              </Alert>
            )}

            <Divider sx={{ my: 1.75 }} />

            {/* PRODUCTS LIST */}
            <Typography fontWeight={800} sx={{ fontSize: "0.88rem", mb: 1 }}>
              Products ({items.length})
            </Typography>

            {items.length === 0 ? (
              <Alert severity="warning" sx={{ py: 0.5, fontSize: "0.78rem" }}>
                Product items were not returned for this order. Saved total is shown below.
              </Alert>
            ) : (
              <Stack spacing={1}>
                {items.map((item, index) => {
                  const productName = getItemName(item);
                  const quantity = Math.max(1, Number(item.quantity || 1));
                  const unitPrice = getUnitPrice(item);
                  const lineTotal = getLineTotal(item);
                  const image = getItemImage(item);
                  const product = getProductFromItem(item);

                  return (
                    <Box key={item._id || `${productName}-${index}`}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {image ? (
                          <Box
                            component="img"
                            src={image}
                            alt={productName}
                            sx={{
                              width: 48,
                              height: 48,
                              objectFit: "contain",
                              borderRadius: 1,
                              border: "1px solid #ECEFEC",
                              bgcolor: "#F7F8F7",
                              flexShrink: 0,
                            }}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "#F7F8F7",
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          >
                            <Inventory2Outlined fontSize="small" color="disabled" />
                          </Box>
                        )}

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} sx={{ fontSize: "0.84rem", lineHeight: 1.3 }}>
                            {productName}
                          </Typography>

                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            {product.brand ? `${product.brand} • ` : ""}
                            Qty: {quantity} × ₹{formatAmount(unitPrice)}
                          </Typography>
                        </Box>

                        <Typography fontWeight={800} sx={{ fontSize: "0.86rem", whiteSpace: "nowrap" }}>
                          ₹{formatAmount(lineTotal)}
                        </Typography>
                      </Stack>

                      {index < items.length - 1 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                  );
                })}
              </Stack>
            )}

            <Divider sx={{ my: 1.75 }} />

            {/* SIDE-BY-SIDE: DELIVERY DETAILS + PAYMENT SUMMARY */}
            <Grid container spacing={2}>
              {hasDeliveryInfo && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      height: "100%",
                      p: 1.5,
                      bgcolor: "#FAFAFA",
                      border: "1px solid #EAEFEA",
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography fontWeight={800} sx={{ fontSize: "0.84rem", mb: 0.75 }}>
                      Delivery Details
                    </Typography>

                    <Stack spacing={0.35}>
                      {customerName && (
                        <Typography sx={{ fontSize: "0.78rem" }}>
                          <strong>Name:</strong> {customerName}
                        </Typography>
                      )}
                      {customerMobile && (
                        <Typography sx={{ fontSize: "0.78rem" }}>
                          <strong>Mobile:</strong> {customerMobile}
                        </Typography>
                      )}
                      {address.address && (
                        <Typography sx={{ fontSize: "0.78rem" }}>
                          <strong>Address:</strong> {address.address}
                        </Typography>
                      )}
                      {(address.city || address.state || address.pincode) && (
                        <Typography sx={{ fontSize: "0.78rem" }}>
                          <strong>Location:</strong>{" "}
                          {[address.city, address.state, address.pincode].filter(Boolean).join(", ")}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12, md: hasDeliveryInfo ? 6 : 12 }}>
                <Box
                  sx={{
                    height: "100%",
                    p: 1.5,
                    bgcolor: "#FAFAFA",
                    border: "1px solid #EAEFEA",
                    borderRadius: 1.5,
                  }}
                >
                  <Typography fontWeight={800} sx={{ fontSize: "0.84rem", mb: 0.75 }}>
                    Payment Summary
                  </Typography>

                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: "0.78rem" }} color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem" }} fontWeight={600}>
                        ₹{formatAmount(order.subtotal)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: "0.78rem" }} color="text.secondary">
                        Discount
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem" }} fontWeight={600}>
                        −₹{formatAmount(order.discount ?? 0)}
                      </Typography>
                    </Stack>

                    {Number(order.walletAmount || 0) > 0 && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: "0.78rem" }} color="text.secondary">
                          Wallet Amount
                        </Typography>
                        <Typography sx={{ fontSize: "0.78rem" }} fontWeight={600}>
                          −₹{formatAmount(order.walletAmount)}
                        </Typography>
                      </Stack>
                    )}

                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: "0.78rem" }} color="text.secondary">
                        Delivery Charge
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem" }} fontWeight={600}>
                        ₹{formatAmount(order.deliveryCharge ?? 0)}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 0.5 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={800} sx={{ fontSize: "0.88rem" }}>
                        Total Amount
                      </Typography>
                      <Typography fontWeight={900} color="success.main" sx={{ fontSize: "1.05rem" }}>
                        ₹{formatAmount(order.finalAmount)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.75 }} />

            {/* COMPACT DELIVERY TRACKING */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
              <LocalShippingOutlined fontSize="small" color="success" />
              <Typography fontWeight={800} sx={{ fontSize: "0.88rem" }}>
                Delivery Tracking
              </Typography>
              <Chip
                size="small"
                label={prettyStatus(packagingStatus)}
                color={packagingStatus === "READY_FOR_DISPATCH" ? "success" : "default"}
                sx={{ height: 20, fontSize: "0.66rem", fontWeight: 700 }}
              />
            </Stack>

            {isCancelled ? (
              <Alert severity="error" sx={{ py: 0.5, fontSize: "0.78rem" }}>
                This order has been cancelled.
              </Alert>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  pb: 0.75,
                  "&::-webkit-scrollbar": { height: 5 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#A5D6A7",
                    borderRadius: 10,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    minWidth: { xs: `${DELIVERY_STEPS.length * 105}px`, md: "100%" },
                    pt: 0.5,
                  }}
                >
                  {DELIVERY_STEPS.map((step, index) => {
                    const reached = index <= activeRank;
                    const timestamp = timestampFields[step.key];
                    const isLast = index === DELIVERY_STEPS.length - 1;

                    return (
                      <Box
                        key={step.key}
                        sx={{
                          flex: { xs: "0 0 105px", md: "1 1 0" },
                          minWidth: { xs: 105, md: 0 },
                          textAlign: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 0.75 }}>
                          {index > 0 && (
                            <Box
                              sx={{
                                height: 2.5,
                                flex: 1,
                                bgcolor: index <= activeRank ? "#2E7D32" : "#D9E0D9",
                              }}
                            />
                          )}

                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: reached ? "#2E7D32" : "#E5E7EB",
                              color: reached ? "#FFFFFF" : "#777777",
                              border: reached ? "2px solid #C8E6C9" : "2px solid #F1F3F1",
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            {reached ? "✓" : index + 1}
                          </Box>

                          {!isLast && (
                            <Box
                              sx={{
                                height: 2.5,
                                flex: 1,
                                bgcolor: index < activeRank ? "#2E7D32" : "#D9E0D9",
                              }}
                            />
                          )}
                        </Box>

                        <Box sx={{ px: 0.4 }}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: reached ? 800 : 600,
                              color: reached ? "#246B2B" : "text.secondary",
                              lineHeight: 1.25,
                            }}
                          >
                            {step.label}
                          </Typography>

                          {timestamp && (
                            <Typography
                              sx={{
                                display: "block",
                                mt: 0.25,
                                fontSize: 9.5,
                                color: "text.secondary",
                                lineHeight: 1.25,
                              }}
                            >
                              {formatDate(timestamp)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* COMPACT PACKAGING HISTORY */}
            {Array.isArray(packagingTracking.history) &&
              packagingTracking.history.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />

                  <Typography fontWeight={800} sx={{ fontSize: "0.82rem", mb: 0.75 }}>
                    Packaging Updates
                  </Typography>

                  <Stack spacing={0.75}>
                    {[...packagingTracking.history].reverse().map((entry, index) => (
                      <Box
                        key={`${entry.action}-${entry.at || index}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.76rem" }}>
                          <strong>{prettyStatus(entry.action)}</strong>
                          {entry.note ? ` — ${entry.note}` : ""}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {formatDate(entry.at)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default OrderDetails;