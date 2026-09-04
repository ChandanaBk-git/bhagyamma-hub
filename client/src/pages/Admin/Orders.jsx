import {
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import {
  Visibility,
  CheckCircle,
} from "@mui/icons-material";

import {
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../services/order.service";


/* ============================================================
   ORDER STATUSES
============================================================ */

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];


/* ============================================================
   PAYMENT STATUSES
============================================================ */

const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];


/* ============================================================
   ADMIN ORDERS
============================================================ */

const AdminOrders = () => {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updating, setUpdating] =
    useState(false);


  /* ==========================================================
     LOAD ORDERS
  ========================================================== */

  useEffect(() => {
    loadOrders();
  }, []);


  const loadOrders = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getAdminOrders();

      console.log(
        "ADMIN ORDERS RESPONSE:",
        response
      );

      let adminOrders = [];

      if (
        Array.isArray(response)
      ) {

        adminOrders = response;

      } else if (
        Array.isArray(response?.orders)
      ) {

        adminOrders =
          response.orders;

      } else if (
        Array.isArray(response?.data)
      ) {

        adminOrders =
          response.data;

      } else if (
        Array.isArray(
          response?.data?.orders
        )
      ) {

        adminOrders =
          response.data.orders;

      }

      console.log(
        "ADMIN ORDERS ARRAY:",
        adminOrders
      );

      setOrders(
        adminOrders
      );

    } catch (err) {

      console.error(
        "ADMIN ORDERS ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load orders.";

      setError(
        message
      );

    } finally {

      setLoading(false);

    }

  };


  /* ==========================================================
     UPDATE PAYMENT STATUS
  ========================================================== */

  const handlePaymentStatus = async (
    orderId,
    paymentStatus
  ) => {

    try {

      setUpdating(true);
      setError("");

      const response =
        await updatePaymentStatus(
          orderId,
          paymentStatus
        );

      console.log(
        "PAYMENT STATUS RESPONSE:",
        response
      );

      const updatedOrder =
        response?.data?.data ||
        response?.data ||
        response;

      setOrders(
        (previous) =>
          previous.map(
            (order) =>
              order._id === orderId
                ? {
                    ...order,
                    ...updatedOrder,
                  }
                : order
          )
      );

      setSelectedOrder(
        (previous) =>
          previous?._id === orderId
            ? {
                ...previous,
                ...updatedOrder,
              }
            : previous
      );

    } catch (err) {

      console.error(
        "UPDATE PAYMENT STATUS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update payment status."
      );

    } finally {

      setUpdating(false);

    }

  };


  /* ==========================================================
     UPDATE ORDER STATUS
  ========================================================== */

  const handleOrderStatus = async (
    orderId,
    status
  ) => {

    try {

      setUpdating(true);
      setError("");

      const response =
        await updateOrderStatus(
          orderId,
          status
        );

      console.log(
        "ORDER STATUS RESPONSE:",
        response
      );

      const updatedOrder =
        response?.data?.data ||
        response?.data ||
        response;

      setOrders(
        (previous) =>
          previous.map(
            (order) =>
              order._id === orderId
                ? {
                    ...order,
                    ...updatedOrder,
                  }
                : order
          )
      );

      setSelectedOrder(
        (previous) =>
          previous?._id === orderId
            ? {
                ...previous,
                ...updatedOrder,
              }
            : previous
      );

    } catch (err) {

      console.error(
        "UPDATE ORDER STATUS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update order status."
      );

    } finally {

      setUpdating(false);

    }

  };


  /* ==========================================================
     ORDER STATUS COLOR
  ========================================================== */

  const statusColor = (status) => {

    switch (
      String(
        status || ""
      ).toUpperCase()
    ) {

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      case "SHIPPED":
        return "info";

      case "CONFIRMED":
      case "PACKED":
        return "primary";

      case "PLACED":
      default:
        return "warning";
    }

  };


  /* ==========================================================
     PAYMENT STATUS COLOR
  ========================================================== */

  const paymentColor = (status) => {

    switch (
      String(
        status || ""
      ).toUpperCase()
    ) {

      case "PAID":
        return "success";

      case "FAILED":
      case "REFUNDED":
        return "error";

      case "PENDING":
      default:
        return "warning";
    }

  };


  /* ==========================================================
     FORMAT DATE
  ========================================================== */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    try {

      return new Date(
        date
      ).toLocaleString(
        "en-IN"
      );

    } catch {

      return "-";

    }

  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "120px",
          width: "100%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={26} />
      </Box>
    );

  }


  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (

    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        margin: 0,

        padding: {
          xs: "10px 8px 20px",
          sm: "14px 14px 24px",
          md: "20px 0 30px",
        },

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >

      {/* ======================================================
          PAGE TITLE
      ====================================================== */}

      <Typography
        component="h1"
        sx={{
          fontSize: {
            xs: "21px",
            sm: "24px",
            md: "28px",
          },

          lineHeight: {
            xs: "26px",
            sm: "30px",
            md: "34px",
          },

          fontWeight: 700,

          color: "#292929",

          margin: 0,

          marginBottom: {
            xs: "12px",
            sm: "16px",
            md: "20px",
          },
        }}
      >
        Orders
      </Typography>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 1.5,

            fontSize: {
              xs: "12px",
              sm: "13px",
            },
          }}

          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>

      )}


      {/* ======================================================
          NO ORDERS
      ====================================================== */}

      {orders.length === 0 ? (

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E0E0E0",

            borderRadius: {
              xs: "10px",
              sm: "12px",
            },
          }}
        >

          <CardContent
            sx={{
              padding: {
                xs: "25px 12px !important",
                sm: "30px !important",
              },
            }}
          >

            <Typography
              align="center"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
              }}
            >
              No orders found.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        /* ====================================================
           ORDERS LIST
        ==================================================== */

        <Box
          sx={{
            width: "100%",

            display: "flex",

            flexDirection: "column",

            gap: {
              xs: "10px",
              sm: "12px",
              md: "14px",
            },
          }}
        >

          {orders.map(
            (order) => (

              <Card
                key={
                  order._id
                }

                elevation={0}

                sx={{
                  width: "100%",
                  maxWidth: "100%",

                  border:
                    "1px solid #E2E2E2",

                  borderRadius: {
                    xs: "16px",
                    sm: "18px",
                    md: "20px",
                  },

                  backgroundColor:
                    "#FFFFFF",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05)",

                  overflow: "hidden",
                }}
              >

                <CardContent
                  sx={{
                    padding: {
                      xs: "12px !important",
                      sm: "15px !important",
                      md: "18px !important",
                    },
                  }}
                >

                  {/* ==========================================
                      TOP ORDER INFORMATION
                  ========================================== */}

                  <Box
                    sx={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "flex-start",

                      gap: "10px",

                      marginBottom: {
                        xs: "10px",
                        sm: "12px",
                      },
                    }}
                  >

                    {/* CUSTOMER */}

                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "15px",
                            sm: "16px",
                            md: "17px",
                          },

                          lineHeight: 1.2,

                          fontWeight: 700,

                          color: "#292929",

                          wordBreak:
                            "break-word",

                          marginBottom:
                            "3px",
                        }}
                      >
                        {order.orderNumber ||
                          "Order"}
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: {
                            xs: "14px",
                            sm: "14px",
                            md: "15px",
                          },

                          lineHeight: 1.3,

                          color: "#333333",

                          wordBreak:
                            "break-word",
                        }}
                      >
                        {order.customerName ||
                          "Customer"}
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: {
                            xs: "13px",
                            sm: "13px",
                            md: "14px",
                          },

                          lineHeight: 1.3,

                          color:
                            "text.secondary",

                          marginTop:
                            "2px",
                        }}
                      >
                        {order.customerMobile ||
                          "-"}
                      </Typography>


                      <Chip
                        size="small"

                        label={
                          order.orderType ||
                          "ORDER"
                        }

                        sx={{
                          marginTop: "5px",

                          height: {
                            xs: "23px",
                            sm: "24px",
                          },

                          fontSize: {
                            xs: "10px",
                            sm: "11px",
                          },

                          backgroundColor:
                            "#EEEEEE",

                          "& .MuiChip-label": {
                            padding:
                              "0 8px",
                          },
                        }}
                      />

                    </Box>


                    {/* AMOUNT */}

                    <Box
                      sx={{
                        flexShrink: 0,

                        textAlign: "right",
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "12px",
                          },

                          lineHeight: 1.2,

                          color:
                            "text.secondary",

                          marginBottom:
                            "2px",
                        }}
                      >
                        Amount
                      </Typography>


                      <Typography
                        sx={{
                          fontSize: {
                            xs: "16px",
                            sm: "18px",
                          },

                          lineHeight: 1.2,

                          fontWeight: 700,

                          color:
                            "#43A047",
                        }}
                      >
                        ₹
                        {Number(
                          order.finalAmount ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>

                    </Box>

                  </Box>


                  <Divider
                    sx={{
                      marginBottom: {
                        xs: "9px",
                        sm: "11px",
                      },
                    }}
                  />


                  {/* ==========================================
                      STATUS SECTION
                  ========================================== */}

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr 1fr",
                        sm: "1fr 1fr",
                      },

                      columnGap: {
                        xs: "10px",
                        sm: "15px",
                      },

                      rowGap: {
                        xs: "8px",
                        sm: "10px",
                      },

                      marginBottom: {
                        xs: "10px",
                        sm: "12px",
                      },
                    }}
                  >

                    {/* PAYMENT */}

                    <Box>

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "12px",
                          },

                          lineHeight: 1.2,

                          color:
                            "text.secondary",

                          marginBottom:
                            "4px",
                        }}
                      >
                        Payment
                      </Typography>


                      <Chip
                        size="small"

                        label={
                          order.paymentStatus ||
                          "PENDING"
                        }

                        color={
                          paymentColor(
                            order.paymentStatus
                          )
                        }

                        sx={{
                          height: {
                            xs: "24px",
                            sm: "25px",
                          },

                          fontSize: {
                            xs: "10px",
                            sm: "11px",
                          },

                          fontWeight: 500,

                          "& .MuiChip-label": {
                            padding:
                              "0 9px",
                          },
                        }}
                      />

                    </Box>


                    {/* ORDER STATUS */}

                    <Box>

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "12px",
                          },

                          lineHeight: 1.2,

                          color:
                            "text.secondary",

                          marginBottom:
                            "4px",
                        }}
                      >
                        Order Status
                      </Typography>


                      <Chip
                        size="small"

                        label={
                          order.status ||
                          "PLACED"
                        }

                        color={
                          statusColor(
                            order.status
                          )
                        }

                        sx={{
                          height: {
                            xs: "24px",
                            sm: "25px",
                          },

                          fontSize: {
                            xs: "10px",
                            sm: "11px",
                          },

                          fontWeight: 500,

                          "& .MuiChip-label": {
                            padding:
                              "0 9px",
                          },
                        }}
                      />

                    </Box>

                  </Box>


                  {/* ==========================================
                      VIEW DETAILS
                  ========================================== */}

                  <Button
                    variant="outlined"

                    startIcon={
                      <Visibility
                        sx={{
                          fontSize: {
                            xs: "17px",
                            sm: "18px",
                          },
                        }}
                      />
                    }

                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }

                    sx={{
                      minHeight: {
                        xs: "36px",
                        sm: "38px",
                      },

                      padding: {
                        xs: "5px 12px",
                        sm: "6px 14px",
                      },

                      borderRadius: {
                        xs: "10px",
                        sm: "10px",
                      },

                      borderColor:
                        "#A5D6A7",

                      color:
                        "#2E7D32",

                      textTransform:
                        "none",

                      fontSize: {
                        xs: "12px",
                        sm: "13px",
                      },

                      "&:hover": {
                        borderColor:
                          "#66BB6A",

                        backgroundColor:
                          "#F1F8F1",
                      },
                    }}
                  >
                    View Details
                  </Button>

                </CardContent>

              </Card>

            )
          )}

        </Box>

      )}


      {/* ======================================================
          ORDER DETAILS DIALOG
      ====================================================== */}

      <Dialog
        open={
          Boolean(
            selectedOrder
          )
        }

        onClose={() =>
          setSelectedOrder(
            null
          )
        }

        fullWidth

        maxWidth="md"

        PaperProps={{
          sx: {
            margin: {
              xs: "10px",
              sm: "20px",
            },

            width: {
              xs: "calc(100% - 20px)",
              sm: "auto",
            },

            maxHeight:
              "calc(100% - 20px)",

            borderRadius: {
              xs: "14px",
              sm: "16px",
            },
          },
        }}
      >

        {selectedOrder && (

          <>

            {/* ==================================================
                TITLE
            ================================================== */}

            <DialogTitle
              sx={{
                padding: {
                  xs: "14px 16px",
                  sm: "18px 24px",
                },

                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },

                fontWeight: 700,
              }}
            >
              Order Details
            </DialogTitle>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <DialogContent
              dividers
              sx={{
                padding: {
                  xs: "14px",
                  sm: "20px 24px",
                },
              }}
            >

              <Stack
                spacing={{
                  xs: 1.2,
                  sm: 2,
                }}
              >

                {/* ORDER NUMBER */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "18px",
                    },

                    fontWeight: 700,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {
                    selectedOrder.orderNumber ||
                    "-"
                  }
                </Typography>


                {/* CUSTOMER */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Customer:{" "}
                  <strong>
                    {
                      selectedOrder.customerName ||
                      "-"
                    }
                  </strong>
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Mobile:{" "}
                  {
                    selectedOrder.customerMobile ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },

                    wordBreak:
                      "break-word",
                  }}
                >
                  Email:{" "}
                  {
                    selectedOrder.customerEmail ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Order Type:{" "}
                  {
                    selectedOrder.orderType ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Date:{" "}
                  {
                    formatDate(
                      selectedOrder.createdAt ||
                      selectedOrder.placedAt
                    )
                  }
                </Typography>


                <Divider />


                {/* DELIVERY DETAILS */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                    },

                    fontWeight: 700,
                  }}
                >
                  Delivery Details
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  {
                    selectedOrder
                      .deliveryDetails
                      ?.name ||
                    selectedOrder.customerName ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Mobile:{" "}
                  {
                    selectedOrder
                      .deliveryDetails
                      ?.mobile ||
                    selectedOrder.customerMobile ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },

                    wordBreak:
                      "break-word",
                  }}
                >
                  {
                    selectedOrder
                      .deliveryDetails
                      ?.address ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  {
                    selectedOrder
                      .deliveryDetails
                      ?.city ||
                    "-"
                  }

                  {" - "}

                  {
                    selectedOrder
                      .deliveryDetails
                      ?.state ||
                    "-"
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Pincode:{" "}
                  {
                    selectedOrder
                      .deliveryDetails
                      ?.pincode ||
                    "-"
                  }
                </Typography>


                <Divider />


                {/* ORDER ITEMS */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                    },

                    fontWeight: 700,
                  }}
                >
                  Order Items
                </Typography>


                {Array.isArray(
                  selectedOrder.items
                ) &&
                selectedOrder.items.length > 0 ? (

                  selectedOrder.items.map(
                    (
                      item,
                      index
                    ) => (

                      <Box
                        key={
                          item._id ||
                          index
                        }

                        sx={{
                          padding: {
                            xs: "9px",
                            sm: "12px",
                          },

                          backgroundColor:
                            "#F7F7F7",

                          borderRadius:
                            "8px",
                        }}
                      >

                        <Typography
                          sx={{
                            fontSize: {
                              xs: "13px",
                              sm: "14px",
                            },

                            fontWeight: 700,
                          }}
                        >
                          {
                            item.productName ||
                            item.productId?.productName ||
                            item.productId?.name ||
                            item.name ||
                            "Product"
                          }
                        </Typography>


                        <Typography
                          sx={{
                            fontSize: {
                              xs: "12px",
                              sm: "13px",
                            },
                          }}
                        >
                          Quantity:{" "}
                          {
                            item.quantity ||
                            0
                          }
                        </Typography>


                        <Typography
                          sx={{
                            fontSize: {
                              xs: "12px",
                              sm: "13px",
                            },
                          }}
                        >
                          Price: ₹
                          {
                            Number(
                              item.price ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )
                          }
                        </Typography>


                        <Typography
                          sx={{
                            fontSize: {
                              xs: "12px",
                              sm: "13px",
                            },
                          }}
                        >
                          Total: ₹
                          {
                            Number(
                              item.total ||
                              (
                                Number(
                                  item.price ||
                                  0
                                ) *
                                Number(
                                  item.quantity ||
                                  0
                                )
                              )
                            ).toLocaleString(
                              "en-IN"
                            )
                          }
                        </Typography>

                      </Box>

                    )

                  )

                ) : (

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "12px",
                        sm: "13px",
                      },
                    }}
                  >
                    No item details available.
                  </Typography>

                )}


                <Divider />


                {/* ORDER TOTAL */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Subtotal: ₹
                  {
                    Number(
                      selectedOrder.subtotal ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Delivery: ₹
                  {
                    Number(
                      selectedOrder.deliveryCharge ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "16px",
                      sm: "18px",
                    },

                    fontWeight: 700,

                    color:
                      "success.main",
                  }}
                >
                  Final Amount: ₹
                  {
                    Number(
                      selectedOrder.finalAmount ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )
                  }
                </Typography>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "14px",
                    },
                  }}
                >
                  Selling Points:{" "}
                  {
                    Number(
                      selectedOrder.sellingPoints ||
                      0
                    )
                  }
                </Typography>


                <Divider />


                {/* PAYMENT CONTROL */}

                <FormControl
                  fullWidth
                  size="small"
                >

                  <InputLabel>
                    Payment Status
                  </InputLabel>

                  <Select
                    label="Payment Status"

                    value={
                      selectedOrder.paymentStatus ||
                      "PENDING"
                    }

                    disabled={
                      updating
                    }

                    onChange={(
                      event
                    ) =>
                      handlePaymentStatus(
                        selectedOrder._id,
                        event.target.value
                      )
                    }
                  >

                    {PAYMENT_STATUSES.map(
                      (
                        status
                      ) => (

                        <MenuItem
                          key={
                            status
                          }

                          value={
                            status
                          }
                        >
                          {
                            status
                          }
                        </MenuItem>

                      )
                    )}

                  </Select>

                </FormControl>


                {/* ORDER STATUS CONTROL */}

                <FormControl
                  fullWidth
                  size="small"
                >

                  <InputLabel>
                    Order Status
                  </InputLabel>

                  <Select
                    label="Order Status"

                    value={
                      selectedOrder.status ||
                      "PLACED"
                    }

                    disabled={
                      updating
                    }

                    onChange={(
                      event
                    ) =>
                      handleOrderStatus(
                        selectedOrder._id,
                        event.target.value
                      )
                    }
                  >

                    {ORDER_STATUSES.map(
                      (
                        status
                      ) => (

                        <MenuItem
                          key={
                            status
                          }

                          value={
                            status
                          }
                        >
                          {
                            status
                          }
                        </MenuItem>

                      )
                    )}

                  </Select>

                </FormControl>


                {/* PAID MESSAGE */}

                {
                  String(
                    selectedOrder.paymentStatus ||
                    ""
                  ).toUpperCase() ===
                  "PAID" && (

                    <Alert
                      severity="success"
                      icon={
                        <CheckCircle />
                      }

                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "13px",
                        },
                      }}
                    >
                      Payment received.
                    </Alert>

                  )
                }

              </Stack>

            </DialogContent>


            {/* CLOSE */}

            <DialogActions
              sx={{
                padding: {
                  xs: "8px 12px",
                  sm: "12px 20px",
                },
              }}
            >

              <Button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }

                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },

                  textTransform:
                    "none",
                }}
              >
                Close
              </Button>

            </DialogActions>

          </>

        )}

      </Dialog>

    </Box>

  );

};


export default AdminOrders;