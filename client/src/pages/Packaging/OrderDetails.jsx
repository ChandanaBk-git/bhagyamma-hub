import React, {
  useEffect,
  useState,
} from "react";

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
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPackagingOrder,
  updatePackagingStatus,
} from "../../api/packaging.api";

/* =========================================================
   PACKAGING STEPS
========================================================= */

const PACKAGING_STEPS = [
  "ASSIGNED",
  "PACKING",
  "PACKED",
  "READY_FOR_DISPATCH",
];

const STATUS_LABELS = {
  ASSIGNED: "Assigned",
  PACKING: "Packing",
  PACKED: "Packed",
  READY_FOR_DISPATCH:
    "Ready for Dispatch",
};

const getStatusLabel = (status) => {
  return (
    STATUS_LABELS[status] ||
    status ||
    "Unknown"
  );
};

/* =========================================================
   DATE
========================================================= */

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

/* =========================================================
   CURRENCY
========================================================= */

const formatCurrency = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const numberValue =
    Number(value);

  if (
    Number.isNaN(numberValue)
  ) {
    return value;
  }

  return `₹${numberValue.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

/* =========================================================
   RESPONSE DATA
========================================================= */

const getOrderData = (
  response
) => {
  const data =
    response?.data?.data ??
    response?.data ??
    {};

  /*
   * Backend returns:
   *
   * {
   *   order,
   *   items,
   *   assignment
   * }
   *
   * Items are at the TOP LEVEL.
   */

  if (data?.order) {
    return {
      order:
        data.order || null,

      items: Array.isArray(
        data.items
      )
        ? data.items
        : [],

      assignment:
        data.assignment ||
        data.packagingAssignment ||
        data.packaging ||
        null,
    };
  }

  return {
    order: data,
    items: Array.isArray(
      data?.items
    )
      ? data.items
      : [],
    assignment:
      data?.assignment ||
      data?.packagingAssignment ||
      data?.packaging ||
      null,
  };
};

/* =========================================================
   CUSTOMER
========================================================= */

const getCustomer = (
  order
) => {
  return (
    order?.customer ||
    order?.user ||
    order?.member ||
    {}
  );
};

/* =========================================================
   DELIVERY DETAILS
========================================================= */

const getDeliveryDetails = (
  order
) => {
  return (
    order?.deliveryDetails ||
    order?.shippingAddress ||
    order?.deliveryAddress ||
    order?.address ||
    {}
  );
};

/* =========================================================
   CUSTOMER NAME
========================================================= */

const getCustomerName = (
  order
) => {
  const customer =
    getCustomer(order);

  const delivery =
    getDeliveryDetails(
      order
    );

  return (
    delivery?.name ||
    customer?.name ||
    customer?.fullName ||
    order?.customerName ||
    "Customer"
  );
};

/* =========================================================
   CUSTOMER MOBILE
========================================================= */

const getCustomerMobile = (
  order
) => {
  const customer =
    getCustomer(order);

  const delivery =
    getDeliveryDetails(
      order
    );

  return (
    delivery?.mobile ||
    delivery?.phone ||
    customer?.mobile ||
    customer?.phone ||
    customer?.phoneNumber ||
    order?.mobile ||
    order?.phone ||
    ""
  );
};

/* =========================================================
   CUSTOMER EMAIL
========================================================= */

const getCustomerEmail = (
  order
) => {
  const customer =
    getCustomer(order);

  return (
    customer?.email ||
    order?.email ||
    ""
  );
};

/* =========================================================
   ORDER NUMBER
========================================================= */

const getOrderNumber = (
  order
) => {
  return (
    order?.orderNumber ||
    order?.orderId ||
    order?.number ||
    order?._id ||
    "—"
  );
};

/* =========================================================
   DELIVERY ADDRESS
========================================================= */

const getAddressLine = (
  address
) => {
  if (!address) {
    return "";
  }

  if (
    typeof address ===
    "string"
  ) {
    return address;
  }

  return [
    address?.address,
    address?.addressLine1,
    address?.addressLine2,
    address?.street,
    address?.area,
    address?.locality,
  ]
    .filter(Boolean)
    .join(", ");
};

/* =========================================================
   CITY
========================================================= */

const getCity = (
  order
) => {
  const delivery =
    getDeliveryDetails(
      order
    );

  return (
    delivery?.city ||
    delivery?.district ||
    ""
  );
};

/* =========================================================
   STATE
========================================================= */

const getState = (
  order
) => {
  const delivery =
    getDeliveryDetails(
      order
    );

  return (
    delivery?.state ||
    ""
  );
};

/* =========================================================
   PINCODE
========================================================= */

const getPincode = (
  order
) => {
  const delivery =
    getDeliveryDetails(
      order
    );

  return (
    delivery?.pincode ||
    delivery?.postalCode ||
    delivery?.zip ||
    ""
  );
};

/* =========================================================
   PRODUCT NAME
========================================================= */

const getItemName = (
  item
) => {
  return (
    item?.productId?.name ||
    item?.productId
      ?.productName ||
    item?.productName ||
    item?.name ||
    item?.product?.name ||
    item?.product?.title ||
    "Product"
  );
};

/* =========================================================
   PRODUCT IMAGE
========================================================= */

const getItemImage = (
  item
) => {
  const images =
    item?.productId
      ?.images;

  if (
    Array.isArray(images) &&
    images.length > 0
  ) {
    return images[0];
  }

  return (
    item?.image ||
    item?.imageUrl ||
    item?.product?.image ||
    item?.product?.images?.[0] ||
    ""
  );
};

/* =========================================================
   QUANTITY
========================================================= */

const getItemQuantity = (
  item
) => {
  return Number(
    item?.quantity ??
      item?.qty ??
      1
  );
};

/* =========================================================
   PRICE
========================================================= */

const getItemPrice = (
  item
) => {
  return (
    item?.price ??
    item?.sellingPrice ??
    item?.unitPrice ??
    item?.productId
      ?.price ??
    item?.product?.price ??
    0
  );
};

/* =========================================================
   ITEM TOTAL
========================================================= */

const getItemTotal = (
  item
) => {
  const explicitTotal =
    item?.total ??
    item?.subtotal ??
    item?.lineTotal;

  if (
    explicitTotal !==
      undefined &&
    explicitTotal !== null
  ) {
    return explicitTotal;
  }

  return (
    Number(
      getItemPrice(item)
    ) *
    getItemQuantity(item)
  );
};

/* =========================================================
   WHATSAPP NUMBER
========================================================= */

const getWhatsAppNumber = (
  mobile
) => {
  if (!mobile) {
    return "";
  }

  let number =
    String(mobile).replace(
      /\D/g,
      ""
    );

  /*
   * If customer number is:
   * 9876543210
   *
   * convert to:
   * 919876543210
   */

  if (
    number.length === 10
  ) {
    number = `91${number}`;
  }

  return number;
};

/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

const getWhatsAppMessage = (
  order,
  status
) => {
  const customerName =
    getCustomerName(order);

  const orderNumber =
    getOrderNumber(order);

  const messages = {
    ASSIGNED:
      `Hello ${customerName}, your Bhagyamma Hub order #${orderNumber} has been assigned for processing. We will keep you updated about your order.`,

    PACKING:
      `Hello ${customerName}, your Bhagyamma Hub order #${orderNumber} is currently being packed. We will update you once it is packed.`,

    PACKED:
      `Hello ${customerName}, your Bhagyamma Hub order #${orderNumber} has been packed successfully and is being prepared for dispatch.`,

    READY_FOR_DISPATCH:
      `Hello ${customerName}, your Bhagyamma Hub order #${orderNumber} is ready for dispatch. You will receive the delivery update soon.`,
  };

  return (
    messages[status] || ""
  );
};

/* =========================================================
   OPEN WHATSAPP
========================================================= */

const openWhatsApp = (
  order,
  status
) => {
  const mobile =
    getCustomerMobile(order);

  const whatsappNumber =
    getWhatsAppNumber(
      mobile
    );

  if (!whatsappNumber) {
    window.alert(
      "Customer WhatsApp number is not available."
    );

    return;
  }

  const message =
    getWhatsAppMessage(
      order,
      status
    );

  if (!message) {
    return;
  }

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const PackagingOrderDetails =
  () => {
    const navigate =
      useNavigate();

    const { id } =
      useParams();

    const [order, setOrder] =
      useState(null);

    const [items, setItems] =
      useState([]);

    const [
      assignment,
      setAssignment,
    ] = useState(null);

    const [loading, setLoading] =
      useState(true);

    const [
      refreshing,
      setRefreshing,
    ] = useState(false);

    const [updating, setUpdating] =
      useState(false);

    const [error, setError] =
      useState("");

    const [success, setSuccess] =
      useState("");

    /* =====================================================
       LOAD ORDER
    ===================================================== */

    const loadOrder = async (
      isRefresh = false
    ) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token =
          localStorage.getItem(
            "packagingToken"
          );

        if (!token) {
          localStorage.removeItem(
            "packagingUser"
          );

          navigate(
            "/packaging/login",
            {
              replace: true,
            }
          );

          return;
        }

        const response =
          await getPackagingOrder(
            id,
            token
          );

        const data =
          getOrderData(
            response
          );

        setOrder(
          data?.order || null
        );

        setItems(
          Array.isArray(
            data?.items
          )
            ? data.items
            : []
        );

        setAssignment(
          data?.assignment ||
            null
        );
      } catch (err) {
        console.error(
          "Packaging order details error:",
          err
        );

        const status =
          err?.response?.status;

        if (
          status === 401 ||
          status === 403
        ) {
          localStorage.removeItem(
            "packagingToken"
          );

          localStorage.removeItem(
            "packagingUser"
          );

          navigate(
            "/packaging/login",
            {
              replace: true,
            }
          );

          return;
        }

        setError(
          err?.response?.data
            ?.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
      if (id) {
        loadOrder();
      }
    }, [id]);

    /* =====================================================
       STATUS
    ===================================================== */

    const currentStatus =
      assignment?.status ||
      order?.packagingStatus ||
      "ASSIGNED";

    const currentStep = Math.max(
      PACKAGING_STEPS.indexOf(
        currentStatus
      ),
      0
    );

    const nextStatus =
      currentStep <
      PACKAGING_STEPS.length - 1
        ? PACKAGING_STEPS[
            currentStep + 1
          ]
        : null;

    /* =====================================================
       STATUS UPDATE
    ===================================================== */

    const handleStatusUpdate =
      async () => {
        if (
          !nextStatus ||
          updating
        ) {
          return;
        }

        try {
          setUpdating(true);
          setError("");
          setSuccess("");

          const token =
            localStorage.getItem(
              "packagingToken"
            );

          if (!token) {
            navigate(
              "/packaging/login",
              {
                replace: true,
              }
            );

            return;
          }

          await updatePackagingStatus(
            id,
            nextStatus,
            token
          );

          setSuccess(
            `Order moved to "${getStatusLabel(
              nextStatus
            )}" successfully.`
          );

          await loadOrder(true);
        } catch (err) {
          console.error(
            "Update packaging status error:",
            err
          );

          const status =
            err?.response
              ?.status;

          if (
            status === 401 ||
            status === 403
          ) {
            localStorage.removeItem(
              "packagingToken"
            );

            localStorage.removeItem(
              "packagingUser"
            );

            navigate(
              "/packaging/login",
              {
                replace: true,
              }
            );

            return;
          }

          setError(
            err?.response?.data
              ?.message ||
              "Unable to update packaging status."
          );
        } finally {
          setUpdating(false);
        }
      };

    /* =====================================================
       UPDATE + WHATSAPP
    ===================================================== */

    const handleStatusAndWhatsApp =
      async () => {
        if (
          !nextStatus ||
          updating
        ) {
          return;
        }

        try {
          setUpdating(true);
          setError("");
          setSuccess("");

          const token =
            localStorage.getItem(
              "packagingToken"
            );

          if (!token) {
            navigate(
              "/packaging/login",
              {
                replace: true,
              }
            );

            return;
          }

          await updatePackagingStatus(
            id,
            nextStatus,
            token
          );

          /*
           * Open WhatsApp with
           * the NEW status.
           */

          openWhatsApp(
            order,
            nextStatus
          );

          setSuccess(
            `Order moved to "${getStatusLabel(
              nextStatus
            )}" successfully. WhatsApp message opened.`
          );

          await loadOrder(true);
        } catch (err) {
          console.error(
            "Update packaging status error:",
            err
          );

          const status =
            err?.response
              ?.status;

          if (
            status === 401 ||
            status === 403
          ) {
            localStorage.removeItem(
              "packagingToken"
            );

            localStorage.removeItem(
              "packagingUser"
            );

            navigate(
              "/packaging/login",
              {
                replace: true,
              }
            );

            return;
          }

          setError(
            err?.response?.data
              ?.message ||
              "Unable to update packaging status."
          );
        } finally {
          setUpdating(false);
        }
      };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
      return (
        <Box
          sx={{
            minHeight: 450,
            display: "flex",
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

    /* =====================================================
       ERROR
    ===================================================== */

    if (error && !order) {
      return (
        <Box>
          <Button
            startIcon={
              <ArrowBackRoundedIcon />
            }
            onClick={() =>
              navigate(
                "/packaging/orders"
              )
            }
            sx={{
              mb: 2,
              textTransform:
                "none",
              fontWeight: 700,
            }}
          >
            Back to Orders
          </Button>

          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        </Box>
      );
    }

    if (!order) {
      return (
        <Box>
          <Alert severity="warning">
            Order details are not
            available.
          </Alert>
        </Box>
      );
    }

    /* =====================================================
       DISPLAY DATA
    ===================================================== */

    const customerName =
      getCustomerName(order);

    const customerMobile =
      getCustomerMobile(order);

    const customerEmail =
      getCustomerEmail(order);

    const delivery =
      getDeliveryDetails(
        order
      );

    const addressText =
      getAddressLine(
        delivery
      );

    const orderNumber =
      getOrderNumber(order);

    const paymentStatus =
      order?.paymentStatus ||
      order?.payment?.status ||
      "—";

    const orderTotal =
      order?.grandTotal ??
      order?.totalAmount ??
      order?.total ??
      order?.orderTotal;

    /* =====================================================
       UI
    ===================================================== */

    return (
      <Box>
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            gap: 2,
            mb: 3,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box>
            <Button
              startIcon={
                <ArrowBackRoundedIcon />
              }
              onClick={() =>
                navigate(
                  "/packaging/orders"
                )
              }
              sx={{
                mb: 1,
                ml: -1,
                textTransform:
                  "none",
                fontWeight: 700,
              }}
            >
              Back to Orders
            </Button>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#222222",
              }}
            >
              Order #{orderNumber}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "#777777",
              }}
            >
              View order details and
              update the packaging
              workflow.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              refreshing ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <RefreshRoundedIcon />
              )
            }
            onClick={() =>
              loadOrder(true)
            }
            disabled={refreshing}
            sx={{
              borderRadius: 2,
              textTransform:
                "none",
              fontWeight: 700,
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* =================================================
            ALERTS
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

        {/* =================================================
            PACKAGING STATUS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border:
              "1px solid #eeeeee",
            mb: 3,
          }}
        >
          <CardContent
            sx={{ p: 3 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                justifyContent:
                  "space-between",
                gap: 2,
                mb: 3,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Packaging Status
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#777777",
                    mt: 0.5,
                  }}
                >
                  Current status:{" "}
                  <strong>
                    {getStatusLabel(
                      currentStatus
                    )}
                  </strong>
                </Typography>
              </Box>

              <Chip
                label={getStatusLabel(
                  currentStatus
                )}
                icon={
                  currentStatus ===
                  "PACKED" ? (
                    <CheckCircleRoundedIcon />
                  ) : currentStatus ===
                    "READY_FOR_DISPATCH" ? (
                    <LocalShippingRoundedIcon />
                  ) : (
                    <Inventory2RoundedIcon />
                  )
                }
                sx={{
                  fontWeight: 700,
                  color:
                    "#6a1b9a",
                  backgroundColor:
                    "rgba(106, 27, 154, 0.10)",
                }}
              />
            </Box>

            {/* =============================================
                STEPPER
            ============================================= */}

            <Stepper
              activeStep={
                currentStep
              }
              alternativeLabel
            >
              {PACKAGING_STEPS.map(
                (step) => (
                  <Step
                    key={step}
                  >
                    <StepLabel>
                      {getStatusLabel(
                        step
                      )}
                    </StepLabel>
                  </Step>
                )
              )}
            </Stepper>

            {/* =============================================
                NEXT STATUS BUTTON
            ============================================= */}

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent:
                  "center",
              }}
            >
              {nextStatus ? (
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={1.5}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                  }}
                >
                  {/* NORMAL UPDATE */}

                  <Button
                    variant="outlined"
                    startIcon={
                      updating ? (
                        <CircularProgress
                          size={18}
                        />
                      ) : nextStatus ===
                        "READY_FOR_DISPATCH" ? (
                        <LocalShippingRoundedIcon />
                      ) : (
                        <CheckCircleRoundedIcon />
                      )
                    }
                    onClick={
                      handleStatusUpdate
                    }
                    disabled={
                      updating
                    }
                    sx={{
                      minWidth: 220,
                      borderRadius: 2,
                      textTransform:
                        "none",
                      fontWeight: 700,
                    }}
                  >
                    {updating
                      ? "Updating..."
                      : `Mark as ${getStatusLabel(
                          nextStatus
                        )}`}
                  </Button>

                  {/* UPDATE + WHATSAPP */}

                  <Button
                    variant="contained"
                    startIcon={
                      <WhatsAppIcon />
                    }
                    onClick={
                      handleStatusAndWhatsApp
                    }
                    disabled={
                      updating ||
                      !customerMobile
                    }
                    sx={{
                      minWidth: 250,
                      borderRadius: 2,
                      textTransform:
                        "none",
                      fontWeight: 700,
                      backgroundColor:
                        "#25D366",
                      color: "#ffffff",
                      "&:hover":
                        {
                          backgroundColor:
                            "#128C7E",
                        },
                    }}
                  >
                    {updating
                      ? "Updating..."
                      : `Update & WhatsApp`}
                  </Button>
                </Stack>
              ) : (
                <Alert
                  severity="success"
                  icon={
                    <CheckCircleRoundedIcon />
                  }
                  sx={{
                    width:
                      "100%",
                    borderRadius: 2,
                  }}
                >
                  This order is ready
                  for dispatch.
                  Packaging workflow
                  is complete.
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* =================================================
            CUSTOMER + DELIVERY
        ================================================= */}

        <Grid
          container
          spacing={2}
          sx={{ mb: 2 }}
        >
          {/* CUSTOMER */}

          <Grid
            item
            xs={12}
            md={6}
          >
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border:
                  "1px solid #eeeeee",
              }}
            >
              <CardContent
                sx={{ p: 3 }}
              >
                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <PersonRoundedIcon
                    sx={{
                      color:
                        "#6a1b9a",
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight:
                        800,
                    }}
                  >
                    Customer Details
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#999999",
                      }}
                    >
                      Name
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      {customerName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#999999",
                      }}
                    >
                      Mobile
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          600,
                      }}
                    >
                      {customerMobile ||
                        "—"}
                    </Typography>
                  </Box>

                  {customerEmail && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "#999999",
                        }}
                      >
                        Email
                      </Typography>

                      <Typography
                        variant="body2"
                      >
                        {
                          customerEmail
                        }
                      </Typography>
                    </Box>
                  )}

                  {/* WHATSAPP */}

                  <Box
                    sx={{
                      pt: 1,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={
                        <WhatsAppIcon />
                      }
                      disabled={
                        !customerMobile
                      }
                      onClick={() =>
                        openWhatsApp(
                          order,
                          currentStatus
                        )
                      }
                      sx={{
                        borderRadius:
                          2,
                        textTransform:
                          "none",
                        fontWeight:
                          700,
                        backgroundColor:
                          "#25D366",
                        "&:hover":
                          {
                            backgroundColor:
                              "#128C7E",
                          },
                      }}
                    >
                      WhatsApp Customer
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* DELIVERY */}

          <Grid
            item
            xs={12}
            md={6}
          >
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border:
                  "1px solid #eeeeee",
              }}
            >
              <CardContent
                sx={{ p: 3 }}
              >
                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <LocationOnRoundedIcon
                    sx={{
                      color:
                        "#6a1b9a",
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight:
                        800,
                    }}
                  >
                    Delivery Details
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#999999",
                      }}
                    >
                      Delivery Name
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight:
                          700,
                      }}
                    >
                      {delivery?.name ||
                        customerName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#999999",
                      }}
                    >
                      Mobile
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          600,
                      }}
                    >
                      {customerMobile ||
                        "—"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#999999",
                      }}
                    >
                      Address
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          "#555555",
                        lineHeight:
                          1.7,
                      }}
                    >
                      {addressText ||
                        "—"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        {
                          xs: "1fr",
                          sm: "repeat(3, 1fr)",
                        },
                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "#999999",
                        }}
                      >
                        City
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            600,
                        }}
                      >
                        {getCity(
                          order
                        ) ||
                          "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "#999999",
                        }}
                      >
                        State
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            600,
                        }}
                      >
                        {getState(
                          order
                        ) ||
                          "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "#999999",
                        }}
                      >
                        Pincode
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            600,
                        }}
                      >
                        {getPincode(
                          order
                        ) ||
                          "—"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border:
              "1px solid #eeeeee",
            mb: 2,
          }}
        >
          <CardContent
            sx={{ p: 3 }}
          >
            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 1,
                mb: 2,
              }}
            >
              <PaymentRoundedIcon
                sx={{
                  color:
                    "#6a1b9a",
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight:
                    800,
                }}
              >
                Order Information
              </Typography>
            </Box>

            <Box
              sx={{
                display:
                  "grid",
                gridTemplateColumns:
                  {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      "#999999",
                    display:
                      "block",
                  }}
                >
                  Order Number
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  #{orderNumber}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      "#999999",
                    display:
                      "block",
                  }}
                >
                  Payment Status
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  {paymentStatus}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      "#999999",
                    display:
                      "block",
                  }}
                >
                  Order Total
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight:
                      800,
                  }}
                >
                  {formatCurrency(
                    orderTotal
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border:
              "1px solid #eeeeee",
            mb: 2,
          }}
        >
          <CardContent
            sx={{ p: 3 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  800,
                mb: 2,
              }}
            >
              Products
            </Typography>

            {items.length > 0 ? (
              <Stack spacing={1.5}>
                {items.map(
                  (
                    item,
                    index
                  ) => {
                    const name =
                      getItemName(
                        item
                      );

                    const image =
                      getItemImage(
                        item
                      );

                    const quantity =
                      getItemQuantity(
                        item
                      );

                    const price =
                      getItemPrice(
                        item
                      );

                    const itemTotal =
                      getItemTotal(
                        item
                      );

                    return (
                      <Paper
                        key={
                          item?._id ||
                          item?.id ||
                          index
                        }
                        elevation={
                          0
                        }
                        sx={{
                          p: 1.5,
                          border:
                            "1px solid #eeeeee",
                          borderRadius:
                            2,
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1.5,
                          }}
                        >
                          {/* IMAGE */}

                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius:
                                2,
                              overflow:
                                "hidden",
                              backgroundColor:
                                "#f5f5f5",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              flexShrink:
                                0,
                            }}
                          >
                            {image ? (
                              <img
                                src={
                                  image
                                }
                                alt={
                                  name
                                }
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "cover",
                                }}
                              />
                            ) : (
                              <Inventory2RoundedIcon
                                sx={{
                                  color:
                                    "#aaaaaa",
                                }}
                              />
                            )}
                          </Box>

                          {/* DETAILS */}

                          <Box
                            sx={{
                              flexGrow:
                                1,
                              minWidth:
                                0,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight:
                                  700,
                                color:
                                  "#333333",
                              }}
                            >
                              {
                                name
                              }
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#777777",
                              }}
                            >
                              Quantity:{" "}
                              {
                                quantity
                              }
                            </Typography>
                          </Box>

                          {/* PRICE */}

                          <Box
                            sx={{
                              textAlign:
                                "right",
                              flexShrink:
                                0,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                display:
                                  "block",
                                color:
                                  "#999999",
                              }}
                            >
                              {formatCurrency(
                                price
                              )}{" "}
                              ×{" "}
                              {
                                quantity
                              }
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight:
                                  800,
                                color:
                                  "#333333",
                              }}
                            >
                              {formatCurrency(
                                itemTotal
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  }
                )}
              </Stack>
            ) : (
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                }}
              >
                No product details
                are available for
                this order.
              </Alert>
            )}

            {/* TOTAL */}

            <Divider
              sx={{
                my: 2,
              }}
            />

            <Box
              sx={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                alignItems:
                  "center",
                gap: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight:
                    600,
                  color:
                    "#666666",
                }}
              >
                Total
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight:
                    800,
                }}
              >
                {formatCurrency(
                  orderTotal
                )}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* =================================================
            WHATSAPP STATUS UPDATES
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border:
              "1px solid #eeeeee",
            mb: 2,
          }}
        >
          <CardContent
            sx={{ p: 3 }}
          >
            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: 2,
                mb: 2,
                flexWrap:
                  "wrap",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight:
                      800,
                  }}
                >
                  WhatsApp Customer Updates
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "#777777",
                    mt: 0.5,
                  }}
                >
                  Send the customer a
                  WhatsApp update for
                  each packaging stage.
                </Typography>
              </Box>

              <Chip
                icon={
                  <WhatsAppIcon />
                }
                label={
                  customerMobile
                    ? customerMobile
                    : "Mobile unavailable"
                }
                sx={{
                  fontWeight:
                    700,
                  color:
                    "#128C7E",
                  backgroundColor:
                    "rgba(37,211,102,0.10)",
                }}
              />
            </Box>

            <Stack spacing={1.2}>
              {PACKAGING_STEPS.map(
                (step) => {
                  const isCurrent =
                    currentStatus ===
                    step;

                  const isCompleted =
                    currentStep >
                    PACKAGING_STEPS.indexOf(
                      step
                    );

                  return (
                    <Box
                      key={step}
                      sx={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: 2,
                        p: 1.5,
                        borderRadius:
                          2,
                        border:
                          "1px solid #eeeeee",
                        backgroundColor:
                          isCurrent
                            ? "rgba(37,211,102,0.06)"
                            : "#fafafa",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1.2,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleRoundedIcon
                            sx={{
                              color:
                                "#6a1b9a",
                            }}
                          />
                        ) : (
                          <Inventory2RoundedIcon
                            sx={{
                              color:
                                isCurrent
                                  ? "#25D366"
                                  : "#aaaaaa",
                            }}
                          />
                        )}

                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                800,
                            }}
                          >
                            {getStatusLabel(
                              step
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                "#888888",
                            }}
                          >
                            {isCurrent
                              ? "Current stage"
                              : isCompleted
                              ? "Completed"
                              : "Upcoming"}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant={
                          isCurrent
                            ? "contained"
                            : "outlined"
                        }
                        size="small"
                        startIcon={
                          <WhatsAppIcon />
                        }
                        disabled={
                          !customerMobile
                        }
                        onClick={() =>
                          openWhatsApp(
                            order,
                            step
                          )
                        }
                        sx={{
                          borderRadius:
                            2,
                          textTransform:
                            "none",
                          fontWeight:
                            700,
                          backgroundColor:
                            isCurrent
                              ? "#25D366"
                              : "transparent",
                          color:
                            isCurrent
                              ? "#ffffff"
                              : "#128C7E",
                          borderColor:
                            "#25D366",
                          "&:hover":
                            {
                              backgroundColor:
                                "#128C7E",
                              color:
                                "#ffffff",
                              borderColor:
                                "#128C7E",
                            },
                        }}
                      >
                        WhatsApp Update
                      </Button>
                    </Box>
                  );
                }
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* =================================================
            PACKAGING TIMELINE
        ================================================= */}

        {assignment && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border:
                "1px solid #eeeeee",
            }}
          >
            <CardContent
              sx={{ p: 3 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight:
                    800,
                  mb: 2,
                }}
              >
                Packaging Timeline
              </Typography>

              <Stack spacing={2}>
                {[
                  {
                    label:
                      "Assigned",
                    date:
                      assignment?.assignedAt,
                  },
                  {
                    label:
                      "Packing Started",
                    date:
                      assignment?.packingStartedAt,
                  },
                  {
                    label:
                      "Packed",
                    date:
                      assignment?.packedAt,
                  },
                  {
                    label:
                      "Ready for Dispatch",
                    date:
                      assignment?.readyForDispatchAt,
                  },
                ].map(
                  (item) => (
                    <Box
                      key={
                        item.label
                      }
                      sx={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius:
                            "50%",
                          backgroundColor:
                            item.date
                              ? "#6a1b9a"
                              : "#dddddd",
                          flexShrink:
                            0,
                        }}
                      />

                      <Box
                        sx={{
                          flexGrow:
                            1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              700,
                          }}
                        >
                          {
                            item.label
                          }
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            item.date
                              ? "#555555"
                              : "#aaaaaa",
                        }}
                      >
                        {formatDate(
                          item.date
                        )}
                      </Typography>
                    </Box>
                  )
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

export default PackagingOrderDetails;