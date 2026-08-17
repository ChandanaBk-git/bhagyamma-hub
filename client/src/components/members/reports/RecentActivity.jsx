import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";

const NetworkChart = ({
  summary = {},
}) => {

  const data = [

    {
      subject: "Direct",
      value:
        summary.directMembers || 0,
      fullMark: 100,
    },

    {
      subject: "Level 1",
      value:
        summary.level1Members || 0,
      fullMark: 100,
    },

    {
      subject: "Level 2",
      value:
        summary.level2Members || 0,
      fullMark: 100,
    },

    {
      subject: "Level 3",
      value:
        summary.level3Members || 0,
      fullMark: 100,
    },

    {
      subject: "Total",
      value:
        summary.totalNetworkMembers ||
        summary.totalMembers ||
        0,
      fullMark: 100,
    },

  ];

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius:4,
        mb:3,
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Network Growth
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <RadarChart data={data}>

            <PolarGrid />

            <PolarAngleAxis
              dataKey="subject"
            />

            <PolarRadiusAxis />

            <Radar
              name="Members"
              dataKey="value"
              stroke="#2E7D32"
              fill="#2E7D32"
              fillOpacity={0.6}
            />

            <Legend />

            <Tooltip />

          </RadarChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>

  );

};

export default NetworkChart;