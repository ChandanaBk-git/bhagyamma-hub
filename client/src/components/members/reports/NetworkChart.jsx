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

const NetworkChart = ({
  summary = {},
}) => {
  const data = [
    {
      level: "Direct",
      members:
        Number(summary.directMembers) || 0,
    },

    {
      level: "Level 1",
      members:
        Number(summary.level1Members) || 0,
    },

    {
      level: "Level 2",
      members:
        Number(summary.level2Members) || 0,
    },

    {
      level: "Level 3",
      members:
        Number(summary.level3Members) || 0,
    },

    {
      level: "Total",
      members:
        Number(
          summary.totalNetworkMembers ??
            summary.totalMembers ??
            0
        ),
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
          Network Growth
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Member distribution across network levels
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={350}
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
              dataKey="level"
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
                "Members",
              ]}
            />

            <Bar
              dataKey="members"
              name="Members"
              fill="#1565C0"
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NetworkChart;