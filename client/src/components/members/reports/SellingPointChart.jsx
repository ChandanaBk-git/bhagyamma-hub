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

const SellingPointChart = ({
  summary = {},
}) => {
  const data = [
    {
      type: "Available",
      points:
        Number(
          summary.availableSellingPoints
        ) || 0,
    },

    {
      type: "Redeemed",
      points:
        Number(
          summary.redeemedSellingPoints
        ) || 0,
    },

    {
      type: "Expired",
      points:
        Number(
          summary.expiredSellingPoints
        ) || 0,
    },
  ];

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
          Selling Points
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Current selling point distribution
        </Typography>

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
              dataKey="type"
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
                "Selling Points",
              ]}
            />

            <Bar
              dataKey="points"
              name="Selling Points"
              fill="#F57C00"
              radius={[8, 8, 0, 0]}
              maxBarSize={65}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SellingPointChart;