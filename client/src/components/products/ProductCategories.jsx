import { Box, Chip, Typography } from "@mui/material";

const ProductCategories = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <Box sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color="success.main"
      >
        Browse Categories
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            color={
              selectedCategory === category
                ? "success"
                : "default"
            }
            onClick={() =>
              onSelectCategory(category)
            }
            sx={{
              px: 2,
              py: 2.5,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: "30px",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductCategories;