import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import {
  ShoppingBag,
  CurrencyRupee,
  CalendarMonth,
  CreditCard,
  LocalShipping,
} from "@mui/icons-material";

const OrderDialog = ({
  open,
  onClose,
  order,
}) => {

  if (!order) return null;

  const getStatusColor = (status) => {

    switch (status) {

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      case "SHIPPED":
        return "info";

      case "CONFIRMED":
        return "primary";

      default:
        return "warning";

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        Order Details
      </DialogTitle>

      <DialogContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >

          <Box>

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              {order.orderNumber}
            </Typography>

            <Typography
              color="text.secondary"
            >
              Order Information
            </Typography>

          </Box>

          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
          />

        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <ShoppingBag color="success" />

              <Box>

                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Order Number
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {order.orderNumber}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <CurrencyRupee color="success" />

              <Box>

                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Total Amount
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  ₹{order.finalAmount}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <CreditCard color="success" />

              <Box>

                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Payment Status
                </Typography>

                <Chip
                  label={order.paymentStatus}
                  color={
                    order.paymentStatus === "PAID"
                      ? "success"
                      : "warning"
                  }
                  size="small"
                />

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <LocalShipping color="success" />

              <Box>

                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Order Status
                </Typography>

                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                />

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <CalendarMonth color="success" />

              <Box>

                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Order Date
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {
                    order.placedAt
                      ? new Date(order.placedAt).toLocaleDateString()
                      : "-"
                  }
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <CurrencyRupee color="success" />

              <Box>

                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Selling Points Earned
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {order.sellingPoints || 0} SP
                </Typography>

              </Box>

            </Stack>

          </Grid>

        </Grid>

        {

          order.items?.length > 0 && (

            <>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                Products
              </Typography>

              {

                order.items.map((item, index) => (

                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: "#F8F9FA",
                      borderRadius: 2,
                    }}
                  >

                    <Typography
                      fontWeight="bold"
                    >
                      {item.productName}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Quantity : {item.quantity}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Price : ₹{item.price}
                    </Typography>

                    <Typography
                      color="success.main"
                      fontWeight="bold"
                    >
                      Total : ₹{item.total}
                    </Typography>

                  </Box>

                ))

              }

            </>

          )

        }

      </DialogContent>

    </Dialog>

  );

};

export default OrderDialog;