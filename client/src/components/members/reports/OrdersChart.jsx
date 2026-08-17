import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OrdersChart = ({
  orders = [],
}) => {
  const monthlyData = {};

  orders.forEach((order) => {
    const date = new Date(
      order.placedAt || order.createdAt
    );

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const month = date.toLocaleString(
      "default",
      {
        month: "short",
      }
    );

    monthlyData[month] =
      (monthlyData[month] || 0) + 1;
  });

  const data = Object.keys(monthlyData).map(
    (month) => ({
      month,
      orders: monthlyData[month],
    })
  );

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={1}
        >
          Monthly Orders
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Number of orders placed each month
        </Typography>

        {data.length === 0 ? (
          <Box
            sx={{
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              No order data available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 15,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <Tooltip
                formatter={(value) => [
                  value,
                  "Orders",
                ]}
              />

              <Bar
                dataKey="orders"
                name="Orders"
                fill="#2E7D32"
                radius={[8, 8, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersChart;