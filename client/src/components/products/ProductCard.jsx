import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { getImageUrl } from "../../utils/imageUrl";

const ProductCard = ({ product }) => {
 const imageUrl =
  product.images?.length > 0
    ? getImageUrl(product.images[0])
    : "https://via.placeholder.com/400x300";

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image={imageUrl}
        alt={product.productName}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {product.productName}
        </Typography>

        <Chip
          label={product.category}
          color="success"
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 48,
          }}
        >
          {product.description}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            sx={{
              textDecoration: "line-through",
              color: "gray",
            }}
          >
            ₹{product.mrp}
          </Typography>

          <Typography
            fontWeight="bold"
            color="success.main"
          >
            ₹{product.sellingPrice}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="primary"
          mb={2}
        >
          Stock: {product.stock}
        </Typography>

        <Button
          fullWidth
          variant="contained"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;