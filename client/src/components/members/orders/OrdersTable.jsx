import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ShoppingBag,
  Visibility,
} from "@mui/icons-material";

import { useState } from "react";

import OrderDialog from "./OrderDialog";

const OrdersTable = ({ orders = [] }) => {

  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!orders.length) {

    return (

      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
        }}
      >

        <CardContent>

          <Box
            py={8}
            textAlign="center"
          >

            <ShoppingBag
              sx={{
                fontSize: 70,
                color: "#BDBDBD",
              }}
            />

            <Typography
              variant="h6"
              mt={2}
              fontWeight="bold"
            >
              No Orders Yet
            </Typography>

            <Typography
              color="text.secondary"
            >
              Purchase products to see your orders here.
            </Typography>

          </Box>

        </CardContent>

      </Card>

    );

  }

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

    <>

      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
        }}
      >

        <CardContent>

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
          >
            Order History
          </Typography>

          {

            orders.map((order) => (

              <Box
                key={order._id}
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 3,
                  transition: ".3s",

                  "&:hover": {
                    bgcolor: "#FAFAFA",
                  },
                }}
              >

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
                      fontWeight="bold"
                    >
                      {order.orderNumber}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Amount :
                      {" "}
                      ₹
                      {order.finalAmount}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Payment :
                      {" "}
                      {order.paymentStatus}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Date :
                      {" "}
                      {
                        new Date(
                          order.placedAt
                        ).toLocaleDateString()
                      }
                    </Typography>

                  </Box>

                  <Stack
                    spacing={1}
                    alignItems="flex-end"
                  >

                    <Chip
                      label={order.status}
                      color={
                        getStatusColor(
                          order.status
                        )
                      }
                    />

                    <Button
                      variant="contained"
                      color="success"
                      startIcon={
                        <Visibility />
                      }
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                    >
                      View Details
                    </Button>

                  </Stack>

                </Stack>

                <Divider
                  sx={{
                    mt: 3,
                  }}
                />

              </Box>

            ))

          }

        </CardContent>

      </Card>

      <OrderDialog
        open={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
      />

    </>

  );

};

export default OrdersTable;