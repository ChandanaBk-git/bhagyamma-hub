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
  Stack,
  Typography,
} from "@mui/material";

import {
  Visibility,
} from "@mui/icons-material";

import {
  getManagerOrders,
} from "../../services/order.service";


const ManagerOrders = () => {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);


  useEffect(() => {

    loadOrders();

  }, []);


  const loadOrders =
    async () => {

      try {

        setLoading(true);

        setError("");

        const data =
          await getManagerOrders();


        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "MANAGER ORDERS:",
          err
        );

        setError(
          err?.response?.data?.message ||
          "Unable to load orders."
        );

      } finally {

        setLoading(false);

      }

    };


  const statusColor =
    (status) => {

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
        case "OUT_FOR_DELIVERY":
          return "info";

        case "CONFIRMED":
        case "PACKED":
          return "primary";

        default:
          return "warning";

      }

    };


  const paymentColor =
    (status) => {

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

        default:
          return "warning";

      }

    };


  const formatDate =
    (date) => {

      if (!date) {
        return "-";
      }

      return new Date(
        date
      ).toLocaleString(
        "en-IN"
      );

    };


  if (loading) {

    return (
      <Box
        display="flex"
        justifyContent="center"
        py={8}
      >
        <CircularProgress />
      </Box>
    );

  }


  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Orders
      </Typography>


      <Typography
        color="text.secondary"
        mb={3}
      >
        View member and guest orders.
        Order and payment details are
        read-only for managers.
      </Typography>


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

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {order.orderNumber}
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
                          order.orderType
                        }
                        sx={{
                          mt: 1,
                        }}
                      />

                    </Box>


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
                            order.paymentStatus
                          }
                          color={
                            paymentColor(
                              order.paymentStatus
                            )
                          }
                        />

                      </Box>

                    </Box>


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
                            order.status
                          }
                          color={
                            statusColor(
                              order.status
                            )
                          }
                        />

                      </Box>

                    </Box>


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


      {/* ==================================================
          MANAGER DETAILS
      ================================================== */}

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

            <DialogTitle>
              Order Details
            </DialogTitle>


            <DialogContent>

              <Stack spacing={2}>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {
                    selectedOrder.orderNumber
                  }
                </Typography>


                <Typography>
                  Customer:{" "}
                  <strong>
                    {
                      selectedOrder.customerName
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
                    selectedOrder.orderType
                  }
                </Typography>


                <Typography>
                  Date:{" "}
                  {
                    formatDate(
                      selectedOrder.createdAt
                    )
                  }
                </Typography>


                <Divider />


                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Delivery Details
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


                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Order Items
                </Typography>


                {selectedOrder.items?.map(
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
                          item.productId
                            ?.productName ||
                          "Product"
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                      >
                        Quantity:{" "}
                        {
                          item.quantity
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

                    </Box>

                  )
                )}


                <Divider />


                {/* READ ONLY */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                >

                  <Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Payment Status
                    </Typography>

                    <Box>

                      <Chip
                        label={
                          selectedOrder.paymentStatus
                        }
                        color={
                          paymentColor(
                            selectedOrder.paymentStatus
                          )
                        }
                      />

                    </Box>

                  </Box>


                  <Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Order Status
                    </Typography>

                    <Box>

                      <Chip
                        label={
                          selectedOrder.status
                        }
                        color={
                          statusColor(
                            selectedOrder.status
                          )
                        }
                      />

                    </Box>

                  </Box>

                </Stack>

              </Stack>

            </DialogContent>


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


export default ManagerOrders;