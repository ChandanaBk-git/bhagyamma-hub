import { useState } from "react";

import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

const ProductTabs = ({ product }) => {
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const tabData = [
    {
      label: "Description",
      value: product?.description,
    },
    {
      label: "Benefits",
      value: product?.benefits,
    },
    {
      label: "Ingredients",
      value: product?.ingredients,
    },
    {
      label: "Usage",
      value: product?.usage,
    },
    {
      label: "Storage",
      value: product?.storage,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        mt: {
          xs: 3,
          sm: 4,
        },
        borderRadius: 0,
        border: "1px solid #E1E6E2",
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* TABS */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: {
            xs: 38,
            sm: 42,
          },

          borderBottom: "1px solid #E8ECE9",

          "& .MuiTab-root": {
            minHeight: {
              xs: 38,
              sm: 42,
            },

            minWidth: {
              xs: 90,
              sm: 110,
            },

            px: {
              xs: 1.2,
              sm: 2,
            },

            py: 0,

            textTransform: "none",

            fontSize: {
              xs: "0.6rem",
              sm: "0.7rem",
            },

            fontWeight: 600,

            color: "#777",
          },

          "& .Mui-selected": {
            color: "#1B5E20",
            fontWeight: 700,
          },

          "& .MuiTabs-indicator": {
            height: 2,
            bgcolor: "#1B5E20",
          },
        }}
      >
        {tabData.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
          />
        ))}
      </Tabs>

      {/* CONTENT */}
      <Box
        sx={{
          px: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
          },

          py: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },

          minHeight: {
            xs: 80,
            sm: 100,
          },
        }}
      >
        <Typography
          sx={{
            whiteSpace: "pre-line",
            color: "#666",

            fontSize: {
              xs: "0.62rem",
              sm: "0.7rem",
              md: "0.78rem",
            },

            lineHeight: 1.6,
          }}
        >
          {tabData[value]?.value ||
            `No ${tabData[
              value
            ].label.toLowerCase()} available.`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProductTabs;