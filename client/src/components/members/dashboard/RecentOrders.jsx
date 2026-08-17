import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Divider,
} from "@mui/material";

import {
  ShoppingBag,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const RecentOrders = ({ orders = [] }) => {

  const navigate = useNavigate();

  return (

    <Card
      elevation={2}
      sx={{
        mt: 3,
        borderRadius: 4,
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Recent Orders
          </Typography>

          <Button
            size="small"
            onClick={() =>
              navigate("/member/orders")
            }
          >
            View All
          </Button>

        </Stack>

        {orders.length === 0 ? (

          <Box
            py={4}
            textAlign="center"
          >

            <ShoppingBag
              sx={{
                fontSize: 45,
                color: "#BDBDBD",
              }}
            />

            <Typography
              color="text.secondary"
              mt={2}
            >
              No Orders Found
            </Typography>

          </Box>

        ) : (

          orders
            .slice(0, 3)
            .map((order) => (

              <Box
                key={order._id}
              >

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Box>

                    <Typography
                      fontWeight="bold"
                    >
                      {order.orderNumber}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </Typography>

                  </Box>

                  <Box textAlign="right">

                    <Typography
                      fontWeight="bold"
                    >
                      ₹{order.finalAmount}
                    </Typography>

                    <Chip
                      size="small"
                      label={order.status}
                      color={
                        order.status ===
                        "COMPLETED"
                          ? "success"
                          : order.status ===
                            "PENDING"
                          ? "warning"
                          : "error"
                      }
                    />

                  </Box>

                </Stack>

                <Divider
                  sx={{
                    my: 2,
                  }}
                />

              </Box>

            ))

        )}

      </CardContent>

    </Card>

  );

};

export default RecentOrders;