import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import BuildCircleRoundedIcon from "@mui/icons-material/BuildCircleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import {
  getPackagingDashboard,
  getPackagingOrders,
} from "../../api/packaging.api";

/* =========================================================
   STAT CARDS
========================================================= */

const statCards = [
  {
    key: "totalAssigned",
    label: "Total Orders",
    description: "Orders assigned to you",
    icon: Inventory2RoundedIcon,
  },
  {
    key: "assigned",
    label: "Assigned",
    description: "Waiting to be processed",
    icon: AssignmentTurnedInRoundedIcon,
  },
  {
    key: "packing",
    label: "Packing",
    description: "Currently being packed",
    icon: BuildCircleRoundedIcon,
  },
  {
    key: "packed",
    label: "Packed",
    description: "Packing completed",
    icon: CheckCircleRoundedIcon,
  },
  {
    key: "readyForDispatch",
    label: "Ready",
    description: "Ready for dispatch",
    icon: LocalShippingRoundedIcon,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getPackagingUser = () => {
  try {
    const stored =
      localStorage.getItem("packagingUser") ||
      sessionStorage.getItem("packagingUser");

    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Packaging user parse error:", error);
    return {};
  }
};

const unwrapResponse = (response) => {
  /*
   Backend normally returns:

   {
      statusCode: 200,
      message: "...",
      data: {
         ...
      }
   }
  */

  return (
    response?.data?.data ??
    response?.data ??
    response ??
    {}
  );
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name = "") => {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "P";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const getCustomerName = (order) => {
  return (
    order?.deliveryDetails?.name ||
    order?.shippingAddress?.name ||
    order?.customerName ||
    order?.userId?.name ||
    "Customer"
  );
};

const getOrderAmount = (order) => {
  const amount =
    order?.finalAmount ??
    order?.grandTotal ??
    order?.totalAmount ??
    order?.amount ??
    0;

  return Number(amount || 0).toFixed(2);
};

const getOrderNumber = (order) => {
  return (
    order?.orderNumber ||
    order?.orderNo ||
    order?.orderId ||
    order?._id ||
    "Order"
  );
};

const getItems = (item) => {
  /*
   Backend returns:

   {
      items: [...]
   }

   This fallback also supports older response formats.
  */

  if (Array.isArray(item?.items)) {
    return item.items;
  }

  if (Array.isArray(item?.order?.items)) {
    return item.order.items;
  }

  if (Array.isArray(item?.products)) {
    return item.products;
  }

  return [];
};

const getProductName = (orderItem) => {
  const product = orderItem?.productId;

  return (
    product?.name ||
    product?.productName ||
    orderItem?.productName ||
    orderItem?.name ||
    "Product"
  );
};

const getProductQuantity = (orderItem) => {
  return (
    orderItem?.quantity ??
    orderItem?.qty ??
    1
  );
};

const getProductImage = (orderItem) => {
  const product = orderItem?.productId;

  return (
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.images?.[0] ||
    orderItem?.image ||
    ""
  );
};

const getStatusLabel = (status) => {
  return String(status || "ASSIGNED")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const getStatusColor = (status) => {
  switch (status) {
    case "ASSIGNED":
      return "info";

    case "PACKING":
      return "warning";

    case "PACKED":
      return "success";

    case "READY_FOR_DISPATCH":
      return "secondary";

    default:
      return "default";
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    totalAssigned: 0,
    assigned: 0,
    packing: 0,
    packed: 0,
    readyForDispatch: 0,
  });

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [user, setUser] = useState({});

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = async (
    showLoader = false
  ) => {
    try {
      setError("");

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const currentUser =
        getPackagingUser();

      setUser(currentUser);

      const [
        dashboardResponse,
        ordersResponse,
      ] = await Promise.all([
        getPackagingDashboard(),
        getPackagingOrders(),
      ]);

      /* ---------------------------------------------------
         DASHBOARD DATA
      --------------------------------------------------- */

      const dashboardData =
        unwrapResponse(
          dashboardResponse
        );

      setData({
        totalAssigned:
          Number(
            dashboardData?.totalAssigned || 0
          ),

        assigned:
          Number(
            dashboardData?.assigned || 0
          ),

        packing:
          Number(
            dashboardData?.packing || 0
          ),

        packed:
          Number(
            dashboardData?.packed || 0
          ),

        readyForDispatch:
          Number(
            dashboardData?.readyForDispatch || 0
          ),
      });

      /* ---------------------------------------------------
         ORDERS DATA
      --------------------------------------------------- */

      const ordersData =
        unwrapResponse(
          ordersResponse
        );

      let orders = [];

      if (Array.isArray(ordersData)) {
        orders = ordersData;
      } else if (
        Array.isArray(ordersData?.orders)
      ) {
        orders = ordersData.orders;
      } else if (
        Array.isArray(ordersData?.data)
      ) {
        orders = ordersData.data;
      }

      setRecentOrders(
        orders.slice(0, 6)
      );
    } catch (err) {
      console.error(
        "PACKAGING DASHBOARD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load packaging dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadDashboard(true);
  }, []);

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const totalOrders =
    Number(data?.totalAssigned || 0);

  const completedOrders =
    Number(data?.packed || 0) +
    Number(data?.readyForDispatch || 0);

  const progress =
    totalOrders > 0
      ? Math.min(
          100,
          Math.round(
            (completedOrders /
              totalOrders) *
              100
          )
        )
      : 0;

  const displayName =
    user?.name ||
    "Packaging Staff";

  const initials = useMemo(
    () => getInitials(displayName),
    [displayName]
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
        >
          <CircularProgress
            size={34}
            color="secondary"
          />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Loading packaging dashboard...
          </Typography>
        </Stack>
      </Box>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Stack spacing={2.5}>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  loadDashboard(false)
                }
                sx={{
                  textTransform: "none",
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            WELCOME
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 52,
                      sm: 62,
                    },
                    height: {
                      xs: 52,
                      sm: 62,
                    },
                    flexShrink: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #7B1FA2, #9C27B0)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: {
                      xs: 18,
                      sm: 22,
                    },
                  }}
                >
                  {initials}
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: 19,
                        sm: 23,
                      },
                      fontWeight: 800,
                    }}
                  >
                    Welcome, {displayName}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: 12,
                        sm: 14,
                      },
                      mt: 0.4,
                    }}
                  >
                    Manage and prepare your
                    assigned customer orders.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                      mt: 1,
                    }}
                  >
                    <Chip
                      icon={
                        <StoreRoundedIcon />
                      }
                      label={
                        user?.branchName ||
                        "Branch not assigned"
                      }
                      size="small"
                    />

                    <Chip
                      icon={
                        <BadgeRoundedIcon />
                      }
                      label={
                        user?.loginId ||
                        "No Login ID"
                      }
                      size="small"
                      variant="outlined"
                    />

                    <Chip
                      label="Packaging Staff"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={
                    <PersonRoundedIcon />
                  }
                  onClick={() =>
                    navigate(
                      "/packaging/profile"
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  View Profile
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={
                    <RefreshRoundedIcon
                      sx={{
                        animation:
                          refreshing
                            ? "spin 1s linear infinite"
                            : "none",
                        "@keyframes spin": {
                          from: {
                            transform:
                              "rotate(0deg)",
                          },
                          to: {
                            transform:
                              "rotate(360deg)",
                          },
                        },
                      }}
                    />
                  }
                  onClick={() =>
                    loadDashboard(false)
                  }
                  disabled={refreshing}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
        >
          {statCards.map(
            ({
              key,
              label,
              description,
              icon: Icon,
            }) => (
              <Grid
                item
                xs={6}
                sm={6}
                md={2.4}
                key={key}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border:
                      "1px solid #E5E7EB",
                    borderRadius: 2.5,
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: 1.5,
                        sm: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          "#F3E8FF",
                        color: "#7B1FA2",
                        mb: 1,
                      }}
                    >
                      <Icon />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: 11,
                          sm: 13,
                        },
                        color:
                          "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,
                        fontSize: {
                          xs: 25,
                          sm: 30,
                        },
                        fontWeight: 800,
                      }}
                    >
                      {data?.[key] ?? 0}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color:
                          "text.secondary",
                      }}
                    >
                      {description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  fontWeight={800}
                  fontSize={{
                    xs: 17,
                    sm: 19,
                  }}
                >
                  Packaging Progress
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                >
                  Track your assigned orders.
                </Typography>
              </Box>

              <Typography
                fontWeight={800}
                color="secondary.main"
              >
                {progress}% completed
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              color="secondary"
              sx={{
                mt: 2,
                height: 9,
                borderRadius: 5,
                backgroundColor:
                  "#F3E8FF",
              }}
            />

            <Grid
              container
              spacing={1}
              sx={{ mt: 1 }}
            >
              {[
                [
                  "Assigned",
                  data.assigned,
                ],
                [
                  "Packing",
                  data.packing,
                ],
                [
                  "Packed",
                  data.packed,
                ],
                [
                  "Ready",
                  data.readyForDispatch,
                ],
              ].map(
                ([label, value]) => (
                  <Grid
                    item
                    xs={6}
                    sm={3}
                    key={label}
                  >
                    <Box
                      sx={{
                        p: 1.25,
                        border:
                          "1px solid #E5E7EB",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color="text.secondary"
                      >
                        {label}
                      </Typography>

                      <Typography
                        fontWeight={800}
                        fontSize={20}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  fontWeight={800}
                  fontSize={{
                    xs: 17,
                    sm: 19,
                  }}
                >
                  Recent Assigned Orders
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                  sx={{ mt: 0.3 }}
                >
                  Orders currently assigned
                  to your account.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                onClick={() =>
                  navigate(
                    "/packaging/orders"
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                View All Orders
              </Button>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* EMPTY */}

            {recentOrders.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  textAlign: "center",
                }}
              >
                <Inventory2RoundedIcon
                  sx={{
                    fontSize: 46,
                    color: "#7B1FA2",
                  }}
                />

                <Typography
                  fontWeight={800}
                  sx={{ mt: 1 }}
                >
                  No Orders Assigned
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={13}
                  sx={{ mt: 0.5 }}
                >
                  New orders will appear here
                  when Admin assigns them.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {recentOrders.map(
                  (item) => {
                    const order =
                      item?.order || {};

                    const orderId =
                      item?.orderId ||
                      order?._id;

                    const orderNumber =
                      getOrderNumber(order);

                    const customer =
                      getCustomerName(order);

                    const amount =
                      getOrderAmount(order);

                    const status =
                      item?.status ||
                      "ASSIGNED";

                    const products =
                      getItems(item);

                    return (
                      <Box
                        key={
                          item?.assignmentId ||
                          item?._id ||
                          orderId
                        }
                        sx={{
                          border:
                            "1px solid #E5E7EB",
                          borderRadius: 2.5,
                          p: {
                            xs: 1.5,
                            sm: 2,
                          },
                        }}
                      >
                        {/* ORDER HEADER */}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              fontWeight={800}
                              fontSize={{
                                xs: 14,
                                sm: 15,
                              }}
                            >
                              {orderNumber}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              fontSize={12.5}
                              sx={{
                                mt: 0.3,
                              }}
                            >
                              {customer}
                            </Typography>

                            <Typography
                              fontWeight={800}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              ₹{amount}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              fontSize={11}
                              sx={{
                                mt: 0.3,
                              }}
                            >
                              {formatDate(
                                item?.assignedAt ||
                                  order?.createdAt
                              )}

                              {formatTime(
                                item?.assignedAt
                              ) &&
                                ` • ${formatTime(
                                  item?.assignedAt
                                )}`}
                            </Typography>
                          </Box>

                          <Chip
                            label={getStatusLabel(
                              status
                            )}
                            color={getStatusColor(
                              status
                            )}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          />
                        </Box>

                        {/* PRODUCTS */}

                        <Box
                          sx={{
                            mt: 1.5,
                            pt: 1.5,
                            borderTop:
                              "1px solid #F0F0F0",
                          }}
                        >
                          <Typography
                            fontSize={12}
                            fontWeight={800}
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            PRODUCTS
                          </Typography>

                          {products.length === 0 ? (
                            <Typography
                              fontSize={12}
                              color="text.secondary"
                            >
                              Product details
                              not available.
                            </Typography>
                          ) : (
                            <Stack
                              spacing={0.75}
                            >
                              {products
                                .slice(0, 4)
                                .map(
                                  (
                                    productItem,
                                    index
                                  ) => {
                                    const image =
                                      getProductImage(
                                        productItem
                                      );

                                    return (
                                      <Box
                                        key={
                                          productItem?._id ||
                                          index
                                        }
                                        sx={{
                                          display:
                                            "flex",
                                          alignItems:
                                            "center",
                                          gap: 1,
                                          minWidth: 0,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: 42,
                                            height: 42,
                                            flexShrink: 0,
                                            borderRadius: 1.5,
                                            border:
                                              "1px solid #E5E7EB",
                                            overflow:
                                              "hidden",
                                            backgroundColor:
                                              "#FAFAFA",
                                            display:
                                              "flex",
                                            alignItems:
                                              "center",
                                            justifyContent:
                                              "center",
                                          }}
                                        >
                                          {image ? (
                                            <Box
                                              component="img"
                                              src={image}
                                              alt={getProductName(
                                                productItem
                                              )}
                                              sx={{
                                                width:
                                                  "100%",
                                                height:
                                                  "100%",
                                                objectFit:
                                                  "cover",
                                              }}
                                              onError={(
                                                event
                                              ) => {
                                                event.currentTarget.style.display =
                                                  "none";
                                              }}
                                            />
                                          ) : (
                                            <Inventory2RoundedIcon
                                              sx={{
                                                fontSize: 20,
                                                color:
                                                  "#9CA3AF",
                                              }}
                                            />
                                          )}
                                        </Box>

                                        <Box
                                          sx={{
                                            minWidth: 0,
                                            flex: 1,
                                          }}
                                        >
                                          <Typography
                                            fontSize={
                                              13
                                            }
                                            fontWeight={
                                              700
                                            }
                                            sx={{
                                              overflow:
                                                "hidden",
                                              textOverflow:
                                                "ellipsis",
                                              whiteSpace:
                                                "nowrap",
                                            }}
                                          >
                                            {getProductName(
                                              productItem
                                            )}
                                          </Typography>

                                          <Typography
                                            fontSize={
                                              11.5
                                            }
                                            color="text.secondary"
                                          >
                                            Quantity:{" "}
                                            {getProductQuantity(
                                              productItem
                                            )}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    );
                                  }
                                )}

                              {products.length >
                                4 && (
                                <Typography
                                  fontSize={11.5}
                                  color="secondary.main"
                                  fontWeight={700}
                                >
                                  +
                                  {products.length -
                                    4}{" "}
                                  more products
                                </Typography>
                              )}
                            </Stack>
                          )}
                        </Box>

                        {/* OPEN ORDER */}

                        {orderId && (
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            endIcon={
                              <ArrowForwardRoundedIcon />
                            }
                            onClick={() =>
                              navigate(
                                `/packaging/orders/${orderId}`
                              )
                            }
                            sx={{
                              mt: 1.5,
                              textTransform:
                                "none",
                              fontWeight: 700,
                            }}
                          >
                            Open Order
                          </Button>
                        )}
                      </Box>
                    );
                  }
                )}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",
            borderRadius: 3,
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <AccessTimeRoundedIcon
                color="secondary"
              />

              <Typography
                fontWeight={800}
                fontSize={{
                  xs: 16,
                  sm: 18,
                }}
              >
                Account Information
              </Typography>
            </Box>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={4}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Staff Name
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {user?.name ||
                    "Not available"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Login ID
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {user?.loginId ||
                    "Not available"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Branch
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {user?.branchName ||
                    "Not assigned"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

      </Stack>
    </Box>
  );
};

export default Dashboard;