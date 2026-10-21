
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";

import {
  ArrowBack,
  Inventory2Outlined,
  ShoppingBag,
  LocalShippingOutlined,
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

const REFRESH_INTERVAL_MS = 15000;

// =====================================================
// FORMAT HELPERS
// =====================================================

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

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const cleanStatus = (value) =>
  String(value || "").trim().toUpperCase();

const prettyStatus = (value) =>
  String(value || "PENDING")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

// =====================================================
// PRODUCT HELPERS
// =====================================================

const getProductFromItem = (item) => {
  if (item?.productId && typeof item.productId === "object") {
    return item.productId;
  }

  if (item?.product && typeof item.product === "object") {
    return item.product;
  }

  return {};
};

const getItemName = (item) => {
  const product = getProductFromItem(item);
  const savedName = String(item?.productName || "").trim();

  if (savedName && savedName.toLowerCase() !== "product") {
    return savedName;
  }

  return (
    product.productName ||
    product.name ||
    item?.name ||
    "Product details unavailable"
  );
};

const getItemImage = (item) => {
  const product = getProductFromItem(item);
  const images = product.images;

  if (Array.isArray(images)) {
    return images[0] || "";
  }

  return typeof images === "string" ? images : "";
};

const getUnitPrice = (item) => {
  const product = getProductFromItem(item);
  const savedPrice = Number(item?.price);
  const productPrice = Number(product?.price);

  if (Number.isFinite(savedPrice) && savedPrice > 0) {
    return savedPrice;
  }

  if (Number.isFinite(productPrice) && productPrice >= 0) {
    return productPrice;
  }

  return Number.isFinite(savedPrice) && savedPrice >= 0
    ? savedPrice
    : 0;
};

const getLineTotal = (item) => {
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const savedTotal = Number(item?.total);

  return Number.isFinite(savedTotal) && savedTotal > 0
    ? savedTotal
    : getUnitPrice(item) * quantity;
};

// =====================================================
// DELIVERY TRACKING STEPS
// =====================================================

const DELIVERY_STEPS = [
  {
    key: "PLACED",
    label: "Order placed",
    description: "Your order has been received.",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    description: "Your order is being prepared.",
  },
  {
    key: "PACKING",
    label: "Packing",
    description: "The packaging team is preparing your products.",
  },
  {
    key: "PACKED",
    label: "Packed",
    description: "Your products have been packed.",
  },
  {
    key: "READY_FOR_DISPATCH",
    label: "Ready for dispatch",
    description: "Your package is ready to leave the branch.",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    description: "Your package has been dispatched.",
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
    description: "Your package is on the way to you.",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered.",
  },
];

const statusRank = (status) => {
  const normalized = cleanStatus(status);

  const index = DELIVERY_STEPS.findIndex(
    (step) => step.key === normalized
  );

  return index < 0 ? 0 : index;
};

// =====================================================
// ORDER DETAILS PAGE
// =====================================================

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Return to the correct order list based on the current route.
  // Member orders use MemberLayout; guest orders use MainLayout.
  const backToOrders = location.pathname.startsWith("/member/")
    ? "/member/orders"
    : "/orders";

  const orderId =
    params.orderId ||
    params.id ||
    params._id;

  const initialOrder = location.state?.order || null;

  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [refreshError, setRefreshError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        ""
      : "";

  // =====================================================
  // FETCH LATEST ORDER
  // =====================================================

  const fetchLatestOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setRefreshError("");

      if (token) {
        const latest = await getOrderById(orderId);

        if (
          latest &&
          String(latest._id || latest.orderId) === String(orderId)
        ) {
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

          const latest = (
            Array.isArray(guestOrders) ? guestOrders : []
          ).find(
            (entry) =>
              String(entry._id || entry.orderId) === String(orderId)
          );

          if (latest) {
            setOrder(latest);
          }
        }
      }
    } catch (error) {
      console.error("Refresh order details failed:", error);

      setRefreshError(
        "Could not refresh tracking right now. The order information shown may be from the previous load."
      );
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

  // =====================================================
  // INITIAL LOAD AND AUTOMATIC REFRESH
  // =====================================================

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    }

    fetchLatestOrder();

    const intervalId = window.setInterval(
      fetchLatestOrder,
      REFRESH_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [fetchLatestOrder, initialOrder]);

  // =====================================================
  // DERIVED ORDER VALUES
  // =====================================================

  const items = Array.isArray(order?.items) ? order.items : [];

  const paymentStatus = cleanStatus(
    order?.paymentStatus || "PENDING"
  );

  const normalizedOrderStatus = cleanStatus(
    order?.status || "PLACED"
  );

  const packagingTracking = order?.packagingTracking || {};

  const packagingStatus = cleanStatus(
    packagingTracking.status || "UNASSIGNED"
  );

  const paymentColor =
    paymentStatus === "PAID"
      ? "success"
      : ["FAILED", "CANCELLED", "REFUNDED"].includes(paymentStatus)
        ? "error"
        : "warning";

  const orderColor =
    normalizedOrderStatus === "CANCELLED"
      ? "error"
      : normalizedOrderStatus === "DELIVERED"
        ? "success"
        : "default";

  const customerName =
    order?.customerName ||
    order?.deliveryDetails?.name ||
    "";

  const customerMobile =
    order?.customerMobile ||
    order?.deliveryDetails?.mobile ||
    "";

  const address = order?.deliveryDetails || {};

  const activeRank = useMemo(
    () => statusRank(normalizedOrderStatus),
    [normalizedOrderStatus]
  );

  const isCancelled = normalizedOrderStatus === "CANCELLED";

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading && !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <LinearProgress color="success" />

        <Typography sx={{ mt: 2 }} textAlign="center">
          Loading order details…
        </Typography>
      </Container>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (
    !order ||
    String(order._id || order.orderId) !== String(orderId)
  ) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: "center",
            }}
          >
            <Inventory2Outlined
              sx={{
                fontSize: 60,
                color: "success.main",
                mb: 2,
              }}
            />

            <Typography variant="h5" fontWeight={800}>
              Order details unavailable
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Return to My Orders and select your order again.
            </Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={<ArrowBack />}
              sx={{ mt: 3 }}
              onClick={() => navigate(backToOrders)}
            >
              Back to My Orders
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // =====================================================
  // TRACKING TIMESTAMPS
  // =====================================================

  const timestampFields = {
    PLACED: order.placedAt || order.createdAt,
    CONFIRMED: order.confirmedAt,
    PACKING:
      packagingTracking.packingStartedAt || order.packingAt,
    PACKED:
      packagingTracking.packedAt || order.packedAt,
    READY_FOR_DISPATCH:
      packagingTracking.readyForDispatchAt ||
      order.readyForDispatchAt,
    SHIPPED: order.shippedAt,
    OUT_FOR_DELIVERY: order.outForDeliveryAt,
    DELIVERED: order.deliveredAt,
  };

  // =====================================================
  // MAIN ORDER BILL
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        {/* BACK BUTTON: MEMBER OR PUBLIC ORDERS */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(backToOrders)}
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back to My Orders
        </Button>

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #DDE7DE",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            {/* ORDER HEADING */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <ShoppingBag
                sx={{
                  fontSize: 42,
                  color: "success.main",
                }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h5" fontWeight={900}>
                  Bhagyamma Hub — Order Bill
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  Order No:{" "}
                  {order.orderNumber || order._id || order.orderId}
                </Typography>
              </Box>

              <Button size="small" onClick={fetchLatestOrder}>
                Refresh
              </Button>
            </Stack>

            {refreshError && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {refreshError}
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {/* ORDER AND PAYMENT STATUS */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>

                <Typography fontWeight={700}>
                  {formatDate(order.createdAt || order.placedAt)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Order Status
                </Typography>

                <Chip
                  size="small"
                  label={prettyStatus(normalizedOrderStatus)}
                  color={orderColor}
                  sx={{ mt: 0.5, fontWeight: 700 }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Payment Status
                </Typography>

                <Chip
                  size="small"
                  label={prettyStatus(paymentStatus)}
                  color={paymentColor}
                  sx={{ mt: 0.5, fontWeight: 700 }}
                />
              </Box>
            </Stack>

            {/* DELIVERY DETAILS */}
            {(customerName ||
              customerMobile ||
              address.address ||
              address.city ||
              address.pincode) && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                  Delivery Details
                </Typography>

                <Stack spacing={1}>
                  {customerName && (
                    <Typography>
                      <strong>Name:</strong> {customerName}
                    </Typography>
                  )}

                  {customerMobile && (
                    <Typography>
                      <strong>Mobile:</strong> {customerMobile}
                    </Typography>
                  )}

                  {address.address && (
                    <Typography>
                      <strong>Address:</strong> {address.address}
                    </Typography>
                  )}

                  {(address.city || address.state || address.pincode) && (
                    <Typography>
                      <strong>Location:</strong>{" "}
                      {[
                        address.city,
                        address.state,
                        address.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  )}
                </Stack>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {/* PRODUCT ITEMS */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Products
            </Typography>

            {items.length === 0 ? (
              <Alert severity="warning">
                Product items were not returned for this order.
                The saved order total is shown below. Please check
                the OrderItem records for this order.
              </Alert>
            ) : (
              <Stack spacing={2}>
                {items.map((item, index) => {
                  const productName = getItemName(item);

                  const quantity = Math.max(
                    1,
                    Number(item.quantity || 1)
                  );

                  const unitPrice = getUnitPrice(item);
                  const lineTotal = getLineTotal(item);
                  const image = getItemImage(item);
                  const product = getProductFromItem(item);

                  return (
                    <Box
                      key={item._id || `${productName}-${index}`}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        {image ? (
                          <Box
                            component="img"
                            src={image}
                            alt={productName}
                            sx={{
                              width: 76,
                              height: 88,
                              objectFit: "contain",
                              borderRadius: 1,
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
                              width: 76,
                              height: 88,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "#F7F8F7",
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          >
                            <Inventory2Outlined color="disabled" />
                          </Box>
                        )}

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700}>
                            {productName}
                          </Typography>

                          {product.brand && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Brand: {product.brand}
                            </Typography>
                          )}

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Quantity: {quantity}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Unit price: ₹{formatAmount(unitPrice)}
                          </Typography>
                        </Box>

                        <Typography
                          fontWeight={800}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          ₹{formatAmount(lineTotal)}
                        </Typography>
                      </Stack>

                      {index < items.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}

            <Divider sx={{ my: 3 }} />

            {/* PAYMENT SUMMARY */}
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Payment Summary
            </Typography>

            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography color="text.secondary">
                  Subtotal
                </Typography>

                <Typography fontWeight={600}>
                  ₹{formatAmount(order.subtotal)}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography color="text.secondary">
                  Discount
                </Typography>

                <Typography fontWeight={600}>
                  −₹{formatAmount(order.discount ?? 0)}
                </Typography>
              </Stack>

              {Number(order.walletAmount || 0) > 0 && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography color="text.secondary">
                    Wallet Amount
                  </Typography>

                  <Typography fontWeight={600}>
                    −₹{formatAmount(order.walletAmount)}
                  </Typography>
                </Stack>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography color="text.secondary">
                  Delivery Charge
                </Typography>

                <Typography fontWeight={600}>
                  ₹{formatAmount(order.deliveryCharge ?? 0)}
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h6" fontWeight={900}>
                  Total Amount
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={900}
                  color="success.main"
                >
                  ₹{formatAmount(order.finalAmount)}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* DELIVERY TRACKING */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <LocalShippingOutlined color="success" />

              <Typography variant="h6" fontWeight={800}>
                Delivery Tracking
              </Typography>

              <Chip
                size="small"
                label={prettyStatus(packagingStatus)}
                color={
                  packagingStatus === "READY_FOR_DISPATCH"
                    ? "success"
                    : "default"
                }
              />
            </Stack>

            {isCancelled ? (
              <Alert severity="error">
                This order has been cancelled.
              </Alert>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  pb: 2,
                  "&::-webkit-scrollbar": {
                    height: 6,
                  },
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
                    minWidth: {
                      xs: `${DELIVERY_STEPS.length * 135}px`,
                      md: "100%",
                    },
                    pt: 1,
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
                          flex: {
                            xs: "0 0 135px",
                            md: "1 1 0",
                          },
                          minWidth: { xs: 135, md: 0 },
                          textAlign: "center",
                        }}
                      >
                        {/* TRACKING LINE AND STATUS CIRCLE */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            mb: 1.5,
                          }}
                        >
                          {index > 0 && (
                            <Box
                              sx={{
                                height: 3,
                                flex: 1,
                                bgcolor:
                                  index <= activeRank
                                    ? "#2E7D32"
                                    : "#D9E0D9",
                              }}
                            />
                          )}

                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: reached
                                ? "#2E7D32"
                                : "#E5E7EB",
                              color: reached
                                ? "#FFFFFF"
                                : "#777777",
                              border: reached
                                ? "3px solid #C8E6C9"
                                : "3px solid #F1F3F1",
                              fontSize: 13,
                              fontWeight: 900,
                            }}
                          >
                            {reached ? "✓" : index + 1}
                          </Box>

                          {!isLast && (
                            <Box
                              sx={{
                                height: 3,
                                flex: 1,
                                bgcolor:
                                  index < activeRank
                                    ? "#2E7D32"
                                    : "#D9E0D9",
                              }}
                            />
                          )}
                        </Box>

                        {/* TRACKING STAGE DETAILS */}
                        <Box sx={{ px: 0.75 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: reached ? 800 : 600,
                              color: reached
                                ? "#246B2B"
                                : "text.secondary",
                              lineHeight: 1.4,
                            }}
                          >
                            {step.label}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: 10,
                              color: "text.secondary",
                              lineHeight: 1.4,
                            }}
                          >
                            {step.description}
                          </Typography>

                          {timestamp && (
                            <Typography
                              sx={{
                                display: "block",
                                mt: 0.5,
                                fontSize: 10,
                                color: "text.secondary",
                                lineHeight: 1.4,
                              }}
                            >
                              {formatDate(timestamp)}
                            </Typography>
                          )}

                          {reached && (
                            <Typography
                              sx={{
                                display: "block",
                                mt: 0.5,
                                fontSize: 10,
                                color: "#2E7D32",
                                fontWeight: 700,
                              }}
                            >
                              {step.key === normalizedOrderStatus
                                ? "Current status"
                                : "Completed"}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* PACKAGING HISTORY */}
            {Array.isArray(packagingTracking.history) &&
              packagingTracking.history.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />

                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{ mb: 1.5 }}
                  >
                    Packaging Updates
                  </Typography>

                  <Stack spacing={1.5}>
                    {[...packagingTracking.history]
                      .reverse()
                      .map((entry, index) => (
                        <Box
                          key={`${entry.action}-${entry.at || index}`}
                        >
                          <Typography fontWeight={700}>
                            {prettyStatus(entry.action)}
                          </Typography>

                          {entry.note && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {entry.note}
                            </Typography>
                          )}

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
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
