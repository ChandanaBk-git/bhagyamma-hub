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
      value: product.description,
    },
    {
      label: "Benefits",
      value: product.benefits,
    },
    {
      label: "Ingredients",
      value: product.ingredients,
    },
    {
      label: "Usage",
      value: product.usage,
    },
    {
      label: "Storage",
      value: product.storage,
    },
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 5,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabData.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
          />
        ))}
      </Tabs>

      <Box p={4}>
        <Typography
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 2,
          }}
        >
          {tabData[value].value ||
            `No ${tabData[
              value
            ].label.toLowerCase()} available.`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProductTabs;