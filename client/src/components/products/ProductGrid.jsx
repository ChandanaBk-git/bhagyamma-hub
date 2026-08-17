import { Box, Typography } from "@mui/material";

import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return (
      <Box
        sx={{
          py: 10,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#777",

            fontSize: "1rem",
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
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },

        gap: {
          xs: 2,
          sm: 2.5,
          md: 3,
          lg: 3.5,
        },

        pb: {
          xs: 4,
          md: 7,
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