import React, { useEffect, useState } from "react";

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

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPackagingOrder,
  updatePackagingStatus,
} from "../../api/packaging.api";


/* =========================================================
   STATUS
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

const formatCurrency = (value) => {
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
    Number.isNaN(
      numberValue
    )
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
   RESPONSE
========================================================= */

const getOrderData = (
  response
) => {

  const data =
    response?.data?.data ??
    response?.data ??
    {};

  return {
    order:
      data?.order ||
      data,

    items:
      Array.isArray(
        data?.items
      )
        ? data.items
        : [],

    assignment:
      data?.assignment ||
      data?.packagingAssignment ||
      null,
  };
};


/* =========================================================
   CUSTOMER
========================================================= */

const getCustomerName = (
  order
) => {

  return (
    order?.deliveryDetails?.name ||
    order?.customerName ||
    order?.userId?.name ||
    "Customer"
  );
};


const getCustomerMobile = (
  order
) => {

  return (
    order?.deliveryDetails?.mobile ||
    order?.customerMobile ||
    order?.userId?.mobile ||
    ""
  );
};


const getCustomerEmail = (
  order
) => {

  return (
    order?.customerEmail ||
    order?.userId?.email ||
    ""
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
    {}
  );
};


const getAddressLine = (
  delivery
) => {

  return [
    delivery?.address,
    delivery?.city,
    delivery?.state,
    delivery?.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};


/* =========================================================
   ORDER NUMBER
========================================================= */

const getOrderNumber = (
  order
) => {

  return (
    order?.orderNumber ||
    order?.orderNo ||
    order?.orderId ||
    order?._id ||
    "—"
  );
};


/* =========================================================
   PRODUCT
========================================================= */

const getItemName = (
  item
) => {

  const product =
    item?.productId;

  return (
    product?.name ||
    product?.productName ||
    item?.productName ||
    item?.name ||
    "Product"
  );
};


const getItemImage = (
  item
) => {

  const product =
    item?.productId;

  return (
    product?.images?.[0] ||
    product?.image ||
    product?.imageUrl ||
    item?.image ||
    item?.imageUrl ||
    ""
  );
};


const getItemQuantity = (
  item
) => {

  return Number(
    item?.quantity ??
      item?.qty ??
      1
  );
};


const getItemPrice = (
  item
) => {

  const product =
    item?.productId;

  return (
    item?.price ??
    item?.sellingPrice ??
    item?.unitPrice ??
    product?.price ??
    0
  );
};


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
   COMPONENT
========================================================= */

const PackagingOrderDetails =
  () => {

    const navigate =
      useNavigate();

    const { id } =
      useParams();


    const [
      order,
      setOrder,
    ] = useState(null);


    const [
      items,
      setItems,
    ] = useState([]);


    const [
      assignment,
      setAssignment,
    ] = useState(null);


    const [
      loading,
      setLoading,
    ] = useState(true);


    const [
      refreshing,
      setRefreshing,
    ] = useState(false);


    const [
      updating,
      setUpdating,
    ] = useState(false);


    const [
      error,
      setError,
    ] = useState("");


    const [
      success,
      setSuccess,
    ] = useState("");


    /* =====================================================
       LOAD ORDER
    ===================================================== */

    const loadOrder =
      async (
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


          /*
          IMPORTANT:
          Store ITEMS separately.
          */

          setOrder(
            data.order ||
              null
          );


          setItems(
            Array.isArray(
              data.items
            )
              ? data.items
              : []
          );


          setAssignment(
            data.assignment ||
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
            err?.response?.data?.message ||
            "Unable to load order details."
          );

        } finally {

          setLoading(false);
          setRefreshing(false);
        }
      };


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
      "ASSIGNED";


    const currentStep =
      Math.max(
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
       UPDATE STATUS
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


          setError(
            err?.response?.data?.message ||
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (
      error &&
      !order
    ) {

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
          >
            {error}
          </Alert>

        </Box>
      );
    }


    if (!order) {

      return (
        <Alert severity="warning">
          Order details are not
          available.
        </Alert>
      );
    }


    const delivery =
      getDeliveryDetails(
        order
      );


    const addressText =
      getAddressLine(
        delivery
      );


    const orderNumber =
      getOrderNumber(
        order
      );


    const paymentStatus =
      order?.paymentStatus ||
      "—";


    const orderTotal =
      order?.finalAmount ??
      order?.grandTotal ??
      order?.totalAmount ??
      order?.total ??
      0;


    return (
      <Box>

        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
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
              }}
            >
              Order #
              {orderNumber}
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
            border:
              "1px solid #eeeeee",
            borderRadius: 3,
            mb: 3,
          }}
        >

          <CardContent sx={{ p: 3 }}>

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ mb: 3 }}
            >
              Packaging Status
            </Typography>


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


            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent:
                  "center",
              }}
            >

              {nextStatus ? (

                <Button
                  variant="contained"
                  startIcon={
                    updating ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )
                  }
                  onClick={
                    handleStatusUpdate
                  }
                  disabled={updating}
                  sx={{
                    minWidth: 220,
                    borderRadius: 2,
                    textTransform:
                      "none",
                    fontWeight: 700,
                    backgroundColor:
                      "#6a1b9a",
                    "&:hover": {
                      backgroundColor:
                        "#4a126b",
                    },
                  }}
                >
                  {updating
                    ? "Updating..."
                    : `Mark as ${getStatusLabel(
                        nextStatus
                      )}`}
                </Button>

              ) : (

                <Alert
                  severity="success"
                >
                  This order is ready
                  for dispatch.
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
                border:
                  "1px solid #eeeeee",
                borderRadius: 3,
              }}
            >

              <CardContent sx={{ p: 3 }}>

                <Box
                  sx={{
                    display: "flex",
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
                    fontWeight={800}
                  >
                    Customer Details
                  </Typography>

                </Box>


                <Typography
                  fontWeight={700}
                >
                  {getCustomerName(
                    order
                  )}
                </Typography>


                {getCustomerMobile(
                  order
                ) && (

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                    }}
                  >
                    Mobile:{" "}
                    {
                      getCustomerMobile(
                        order
                      )
                    }
                  </Typography>

                )}


                {getCustomerEmail(
                  order
                ) && (

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      color:
                        "#666",
                    }}
                  >
                    Email:{" "}
                    {
                      getCustomerEmail(
                        order
                      )
                    }
                  </Typography>

                )}

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
                border:
                  "1px solid #eeeeee",
                borderRadius: 3,
                backgroundColor:
                  "#fafafa",
              }}
            >

              <CardContent sx={{ p: 3 }}>

                <Box
                  sx={{
                    display: "flex",
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
                    fontWeight={800}
                  >
                    Delivery Details
                  </Typography>

                </Box>


                <Typography
                  fontWeight={700}
                >
                  {delivery?.name ||
                    "—"}
                </Typography>


                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.7,
                  }}
                >
                  Mobile:{" "}
                  {delivery?.mobile ||
                    "—"}
                </Typography>


                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color:
                      "#555",
                    lineHeight:
                      1.8,
                  }}
                >
                  {addressText ||
                    "Delivery address not available."}
                </Typography>


                {delivery?.address && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor:
                        "#ffffff",
                      border:
                        "1px solid #eeeeee",
                    }}
                  >

                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#999",
                        display:
                          "block",
                        mb: 0.5,
                      }}
                    >
                      Address
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {
                        delivery.address
                      }
                    </Typography>

                  </Box>
                )}

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
            border:
              "1px solid #eeeeee",
            borderRadius: 3,
            mb: 2,
          }}
        >

          <CardContent sx={{ p: 3 }}>

            <Box
              sx={{
                display: "flex",
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
                fontWeight={800}
              >
                Order Information
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
                  Order Date
                </Typography>

                <Typography
                  fontWeight={700}
                >
                  {formatDate(
                    order?.createdAt
                  )}
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
                  Payment Status
                </Typography>

                <Typography
                  fontWeight={700}
                >
                  {paymentStatus}
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
                  Order Total
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {formatCurrency(
                    orderTotal
                  )}
                </Typography>

              </Grid>

            </Grid>

          </CardContent>

        </Card>


        {/* =================================================
            PRODUCTS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #eeeeee",
            borderRadius: 3,
            mb: 2,
          }}
        >

          <CardContent sx={{ p: 3 }}>

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                mb: 2,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                }}
              >

                <Inventory2RoundedIcon
                  sx={{
                    color:
                      "#6a1b9a",
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Products
                </Typography>

              </Box>


              <Chip
                label={`${items.length} ${
                  items.length === 1
                    ? "product"
                    : "products"
                }`}
                size="small"
                sx={{
                  fontWeight: 700,
                }}
              />

            </Box>


            {items.length ? (

              <Stack spacing={1.5}>

                {items.map(
                  (
                    item,
                    index
                  ) => {

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

                    const total =
                      getItemTotal(
                        item
                      );

                    return (

                      <Paper
                        key={
                          item?._id ||
                          index
                        }
                        elevation={0}
                        sx={{
                          p: 1.5,
                          border:
                            "1px solid #eeeeee",
                          borderRadius: 2,
                        }}
                      >

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 2,
                          }}
                        >

                          <Box
                            sx={{
                              width: 75,
                              height: 75,
                              flexShrink: 0,
                              borderRadius: 2,
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
                            }}
                          >

                            {image ? (

                              <img
                                src={
                                  image
                                }
                                alt={
                                  getItemName(
                                    item
                                  )
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
                                    "#aaa",
                                }}
                              />

                            )}

                          </Box>


                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                            }}
                          >

                            <Typography
                              fontWeight={800}
                            >
                              {
                                getItemName(
                                  item
                                )
                              }
                            </Typography>


                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  "#777",
                                mt: 0.5,
                              }}
                            >
                              Quantity:{" "}
                              {
                                quantity
                              }
                            </Typography>


                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  "#777",
                              }}
                            >
                              Unit Price:{" "}
                              {
                                formatCurrency(
                                  price
                                )
                              }
                            </Typography>

                          </Box>


                          <Box
                            sx={{
                              textAlign:
                                "right",
                              flexShrink: 0,
                            }}
                          >

                            <Typography
                              variant="body1"
                              fontWeight={800}
                            >
                              {
                                formatCurrency(
                                  total
                                )
                              }
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

          </CardContent>

        </Card>


        {/* =================================================
            TIMELINE
        ================================================= */}

        {assignment && (

          <Card
            elevation={0}
            sx={{
              border:
                "1px solid #eeeeee",
              borderRadius: 3,
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mb: 2 }}
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
                              : "#ddd",
                        }}
                      />


                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >

                        <Typography
                          fontWeight={700}
                        >
                          {
                            item.label
                          }
                        </Typography>

                      </Box>


                      <Typography
                        variant="caption"
                        color="text.secondary"
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