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
   These must match the backend.
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
        "======================================"
      );

      console.log(
        "ADMIN ORDERS RESPONSE:",
        response
      );

      console.log(
        "======================================"
      );


      /*
       * Backend can return either:
       *
       * 1. Array
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * OR
       *
       * 2. Paginated object
       *
       * {
       *   orders: [...],
       *   pagination: {...}
       * }
       *
       * Support both.
       */

      let adminOrders = [];


      if (
        Array.isArray(response)
      ) {

        adminOrders =
          response;

      } else if (
        Array.isArray(
          response?.orders
        )
      ) {

        adminOrders =
          response.orders;

      } else if (
        Array.isArray(
          response?.data
        )
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

      console.log(
        "ADMIN ORDER COUNT:",
        adminOrders.length
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


      /*
       * Depending on the service implementation,
       * the returned order may be:
       *
       * response
       * response.data
       * response.data.data
       */

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

  const statusColor = (
    status
  ) => {

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

  const paymentColor = (
    status
  ) => {

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

  const formatDate = (
    date
  ) => {

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
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={8}
      >

        <CircularProgress />

      </Box>

    );

  }


  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (

    <Box>

      {/* ======================================================
          PAGE TITLE
      ====================================================== */}

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
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
            mb: 2,
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

        <Card>

          <CardContent>

            <Typography
              align="center"
              color="text.secondary"
              py={5}
            >
              No orders found.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        /* ====================================================
           ORDERS LIST
        ==================================================== */

        <Stack spacing={2}>

          {orders.map(
            (order) => (

              <Card
                key={
                  order._id
                }
                sx={{
                  borderRadius: 3,
                }}
              >

                <CardContent>

                  <Stack
                    direction={{
                      xs: "column",
                      md: "row",
                    }}
                    justifyContent="space-between"
                    spacing={2}
                  >

                    {/* ======================================
                        CUSTOMER
                    ====================================== */}

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {order.orderNumber ||
                          "Order"}
                      </Typography>


                      <Typography>
                        {order.customerName ||
                          "Customer"}
                      </Typography>


                      <Typography
                        color="text.secondary"
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
                          mt: 1,
                        }}
                      />

                    </Box>


                    {/* ======================================
                        AMOUNT
                    ====================================== */}

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Amount
                      </Typography>


                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="success.main"
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


                    {/* ======================================
                        PAYMENT
                    ====================================== */}

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Payment
                      </Typography>


                      <Box>

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
                        />

                      </Box>

                    </Box>


                    {/* ======================================
                        ORDER STATUS
                    ====================================== */}

                    <Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Order Status
                      </Typography>


                      <Box>

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
                        />

                      </Box>

                    </Box>


                    {/* ======================================
                        VIEW DETAILS
                    ====================================== */}

                    <Box
                      display="flex"
                      alignItems="center"
                    >

                      <Button
                        variant="outlined"
                        startIcon={
                          <Visibility />
                        }
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                      >
                        View Details
                      </Button>

                    </Box>

                  </Stack>

                </CardContent>

              </Card>

            )
          )}

        </Stack>

      )}


      {/* ======================================================
          ADMIN ORDER DETAILS DIALOG
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
      >

        {selectedOrder && (

          <>

            {/* ==================================================
                TITLE
            ================================================== */}

            <DialogTitle>

              Order Details

            </DialogTitle>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <DialogContent>

              <Stack spacing={2}>


                {/* ==============================================
                    ORDER NUMBER
                ============================================== */}

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {
                    selectedOrder.orderNumber ||
                    "-"
                  }
                </Typography>


                {/* ==============================================
                    CUSTOMER
                ============================================== */}

                <Typography>

                  Customer:{" "}

                  <strong>
                    {
                      selectedOrder.customerName ||
                      "-"
                    }
                  </strong>

                </Typography>


                <Typography>

                  Mobile:{" "}

                  {
                    selectedOrder.customerMobile ||
                    "-"
                  }

                </Typography>


                <Typography>

                  Email:{" "}

                  {
                    selectedOrder.customerEmail ||
                    "-"
                  }

                </Typography>


                <Typography>

                  Order Type:{" "}

                  {
                    selectedOrder.orderType ||
                    "-"
                  }

                </Typography>


                <Typography>

                  Date:{" "}

                  {
                    formatDate(
                      selectedOrder.createdAt ||
                      selectedOrder.placedAt
                    )
                  }

                </Typography>


                <Divider />


                {/* ==============================================
                    DELIVERY DETAILS
                ============================================== */}

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Delivery Details
                </Typography>


                <Typography>

                  {
                    selectedOrder.deliveryDetails
                      ?.name ||
                    selectedOrder.customerName ||
                    "-"
                  }

                </Typography>


                <Typography>

                  Mobile:{" "}

                  {
                    selectedOrder.deliveryDetails
                      ?.mobile ||
                    selectedOrder.customerMobile ||
                    "-"
                  }

                </Typography>


                <Typography>

                  {
                    selectedOrder.deliveryDetails
                      ?.address ||
                    "-"
                  }

                </Typography>


                <Typography>

                  {
                    selectedOrder.deliveryDetails
                      ?.city ||
                    "-"
                  }

                  {" - "}

                  {
                    selectedOrder.deliveryDetails
                      ?.state ||
                    "-"
                  }

                </Typography>


                <Typography>

                  Pincode:{" "}

                  {
                    selectedOrder.deliveryDetails
                      ?.pincode ||
                    "-"
                  }

                </Typography>


                <Divider />


                {/* ==============================================
                    ORDER ITEMS
                ============================================== */}

                <Typography
                  variant="h6"
                  fontWeight="bold"
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
                          p: 1.5,
                          bgcolor:
                            "#F7F7F7",
                          borderRadius: 2,
                        }}
                      >

                        <Typography
                          fontWeight="bold"
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
                          variant="body2"
                        >

                          Quantity:{" "}

                          {
                            item.quantity ||
                            0
                          }

                        </Typography>


                        <Typography
                          variant="body2"
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
                          variant="body2"
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
                  >
                    No item details available.
                  </Typography>

                )}


                <Divider />


                {/* ==============================================
                    ORDER TOTAL
                ============================================== */}

                <Typography>

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


                <Typography>

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
                  variant="h6"
                  fontWeight="bold"
                  color="success.main"
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


                <Typography>

                  Selling Points:{" "}

                  {
                    Number(
                      selectedOrder.sellingPoints ||
                      0
                    )
                  }

                </Typography>


                <Divider />


                {/* ==============================================
                    PAYMENT CONTROL
                ============================================== */}

                <FormControl
                  fullWidth
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


                {/* ==============================================
                    ORDER STATUS CONTROL
                ============================================== */}

                <FormControl
                  fullWidth
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


                {/* ==============================================
                    PAID MESSAGE
                ============================================== */}

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
                    >
                      Payment received.
                    </Alert>

                  )
                }


              </Stack>

            </DialogContent>


            {/* ==================================================
                CLOSE
            ================================================== */}

            <DialogActions>

              <Button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
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