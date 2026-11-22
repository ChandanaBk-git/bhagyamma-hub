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
    { label: "Description", value: product?.description },
    { label: "Benefits", value: product?.benefits },
    { label: "Ingredients", value: product?.ingredients },
    { label: "Usage", value: product?.usage },
    { label: "Storage", value: product?.storage },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        border: "1px solid #E1E6E2",
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* COMPACT TABS */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: 34,
          borderBottom: "1px solid #E8ECE9",
          bgcolor: "#FAFAFA",
          "& .MuiTab-root": {
            minHeight: 34,
            minWidth: { xs: 80, sm: 96 },
            px: { xs: 1.25, sm: 1.75 },
            py: 0,
            textTransform: "none",
            fontSize: { xs: "0.68rem", sm: "0.74rem" },
            fontWeight: 600,
            color: "#666",
          },
          "& .Mui-selected": {
            color: "#1B5E20",
            fontWeight: 700,
            bgcolor: "#FFFFFF",
          },
          "& .MuiTabs-indicator": {
            height: 2,
            bgcolor: "#1B5E20",
          },
        }}
      >
        {tabData.map((tab) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      {/* COMPACT CONTENT */}
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.25, sm: 1.5 },
          minHeight: 56,
        }}
      >
        <Typography
          sx={{
            whiteSpace: "pre-line",
            color: "#555",
            fontSize: { xs: "0.7rem", sm: "0.76rem" },
            lineHeight: 1.55,
          }}
        >
          {tabData[value]?.value ||
            `No ${tabData[value].label.toLowerCase()} available.`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProductTabs;