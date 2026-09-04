import { Box, Typography } from "@mui/material";

import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return (
      <Box
        sx={{
          py: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#777",
            fontSize: "0.8rem",
          }}
        >
          No Products Available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",

        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(5, minmax(0, 1fr))",
        },

        gap: {
          xs: 1,
          sm: 1.5,
          md: 2,
          lg: 1.5,
        },

        pb: {
          xs: 3,
          sm: 4,
          md: 5,
        },

        alignItems: "stretch",
      }}
    >
      {products.map((product) => (
        <Box
          key={product._id}
          sx={{
            minWidth: 0,
            display: "flex",

            "& > *": {
              width: "100%",
            },
          }}
        >
          <ProductCard product={product} />
        </Box>
      ))}
    </Box>
  );
};

export default ProductGrid;