import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  Add,
  Remove,
  Delete,
} from "@mui/icons-material";

import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageUrl";

const CartItem = ({ item }) => {
  const {
    updateQuantity,
    removeItem,
  } = useCart();

  const increaseQuantity = () => {
    updateQuantity(
      item.product._id,
      item.quantity + 1
    );
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(
        item.product._id,
        item.quantity - 1
      );
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: 3,
        borderRadius: 3,
      }}
    >
      <CardMedia
        component="img"
        image={getImageUrl(item.product.images?.[0])}
        alt={item.product.productName}
        sx={{
          width: 170,
          objectFit: "cover",
        }}
      />

      <CardContent sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          {item.product.productName}
        </Typography>

        <Typography
          color="text.secondary"
        >
          {item.product.brand}
        </Typography>

        <Typography
          color="success.main"
          fontWeight="bold"
          mt={1}
        >
          ₹{item.price}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          mt={2}
        >
          <IconButton
            onClick={decreaseQuantity}
          >
            <Remove />
          </IconButton>

          <Typography
            sx={{
              minWidth: 30,
              textAlign: "center",
            }}
          >
            {item.quantity}
          </Typography>

          <IconButton
            onClick={increaseQuantity}
          >
            <Add />
          </IconButton>

          <Box flexGrow={1} />

          <IconButton
            color="error"
            onClick={() =>
              removeItem(item.product._id)
            }
          >
            <Delete />
          </IconButton>
        </Stack>

        <Typography
          mt={2}
          fontWeight="bold"
        >
          Subtotal :
          ₹{item.quantity * item.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CartItem;