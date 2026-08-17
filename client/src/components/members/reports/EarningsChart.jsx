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

const EarningsChart = ({
  commissions = [],
}) => {
  const monthlyData = {};

  commissions.forEach((item) => {
    const date = new Date(item.createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const month = date.toLocaleString("default", {
      month: "short",
    });

    const amount = Number(item.commissionAmount) || 0;

    monthlyData[month] =
      (monthlyData[month] || 0) + amount;
  });

  const data = Object.keys(monthlyData).map(
    (month) => ({
      month,
      earnings: monthlyData[month],
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
          Monthly Earnings
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Commission earnings by month
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
              No earnings data available
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
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  `₹${value}`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`,
                  "Earnings",
                ]}
              />

              <Bar
                dataKey="earnings"
                name="Earnings"
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

export default EarningsChart;