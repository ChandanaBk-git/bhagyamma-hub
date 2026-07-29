import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { getImageUrl } from "../../utils/imageUrl";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const imageUrl =
    product.images?.length > 0
      ? `src={getImageUrl(product.images[0])}`
      : "https://via.placeholder.com/400x300";

  return (
    <Card
      sx={{
        width: "100%",
        height: 520,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={product.productName}
        sx={{
          height: 220,
          width: "100%",
          objectFit: "contain",
          backgroundColor: "#fafafa",
          p: 2,
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            minHeight: 56,
            maxHeight: 56,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
          }}
        >
          {product.productName}
        </Typography>

        {/* Category */}
        <Chip
          label={product.category}
          color="success"
          size="small"
          sx={{
            mt: 1,
            mb: 1.5,
            width: "fit-content",
          }}
        />

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: 48,
            maxHeight: 48,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
          }}
        >
          {product.description}
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Price */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography
            sx={{
              textDecoration: "line-through",
              color: "gray",
              fontSize: 15,
            }}
          >
            ₹{product.mrp}
          </Typography>

          <Typography
            color="success.main"
            fontWeight="bold"
            fontSize={20}
          >
            ₹{product.sellingPrice}
          </Typography>
        </Box>

        {/* Stock */}
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            mb: 2,
            color:
              product.stock > 0
                ? "success.main"
                : "error.main",
          }}
        >
          Stock: {product.stock}
        </Typography>

        {/* View Details */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() =>
            navigate(`/products/${product._id}`)
          }
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;