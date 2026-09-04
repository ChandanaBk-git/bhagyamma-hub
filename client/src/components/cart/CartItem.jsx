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
  DeleteOutline,
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

  const subtotal =
    item.quantity * item.price;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",

        display: "flex",

        borderRadius: 0,

        border: "1px solid #E1E6E2",

        bgcolor: "#fff",

        overflow: "hidden",

        mb: {
          xs: 1,
          sm: 1.5,
        },

        transition: "border-color 0.2s ease",

        "&:hover": {
          borderColor: "#B8CDBA",
        },
      }}
    >
      {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

      <Box
        sx={{
          width: {
            xs: 90,
            sm: 120,
            md: 145,
          },

          minWidth: {
            xs: 90,
            sm: 120,
            md: 145,
          },

          height: {
            xs: 105,
            sm: 125,
            md: 145,
          },

          bgcolor: "#F7F8F7",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          borderRight:
            "1px solid #E8ECE9",
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(
            item.product.images?.[0]
          )}
          alt={
            item.product.productName ||
            "Product"
          }
          sx={{
            width: "100%",

            height: "100%",

            objectFit: "contain",

            p: {
              xs: 0.8,
              sm: 1,
              md: 1.5,
            },
          }}
        />
      </Box>

      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      <CardContent
        sx={{
          flex: 1,

          minWidth: 0,

          p: {
            xs: 1,
            sm: 1.5,
            md: 2,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
          },
        }}
      >
        {/* PRODUCT NAME */}

        <Typography
          sx={{
            color: "#222",

            fontWeight: 700,

            fontSize: {
              xs: "0.72rem",
              sm: "0.82rem",
              md: "0.92rem",
            },

            lineHeight: 1.3,

            display: "-webkit-box",

            WebkitLineClamp: 2,

            WebkitBoxOrient: "vertical",

            overflow: "hidden",
          }}
        >
          {item.product.productName}
        </Typography>

        {/* BRAND */}

        {item.product.brand && (
          <Typography
            sx={{
              mt: 0.3,

              color: "#777",

              fontSize: {
                xs: "0.55rem",
                sm: "0.62rem",
                md: "0.68rem",
              },

              lineHeight: 1.3,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {item.product.brand}
          </Typography>
        )}

        {/* PRICE */}

        <Typography
          sx={{
            mt: {
              xs: 0.6,
              sm: 0.8,
            },

            color: "#1B5E20",

            fontWeight: 700,

            fontSize: {
              xs: "0.78rem",
              sm: "0.9rem",
              md: "1rem",
            },
          }}
        >
          ₹{item.price}
        </Typography>

        {/* =================================================
            QUANTITY + DELETE
        ================================================= */}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mt: {
              xs: 0.7,
              sm: 1,
            },

            width: "100%",
          }}
        >
          {/* MINUS */}

          <IconButton
            onClick={decreaseQuantity}
            disabled={item.quantity <= 1}
            size="small"
            sx={{
              width: {
                xs: 25,
                sm: 28,
              },

              height: {
                xs: 25,
                sm: 28,
              },

              p: 0,

              border: "1px solid #D7DED8",

              borderRadius: 0,

              color: "#2E7D32",

              "&:hover": {
                bgcolor: "#E8F5E9",
              },

              "&.Mui-disabled": {
                color: "#B8BEB9",
                borderColor: "#E5E8E5",
              },
            }}
          >
            <Remove
              sx={{
                fontSize: {
                  xs: 14,
                  sm: 16,
                },
              }}
            />
          </IconButton>

          {/* QUANTITY */}

          <Typography
            sx={{
              minWidth: {
                xs: 25,
                sm: 30,
              },

              textAlign: "center",

              fontSize: {
                xs: "0.68rem",
                sm: "0.75rem",
              },

              fontWeight: 600,

              color: "#333",
            }}
          >
            {item.quantity}
          </Typography>

          {/* PLUS */}

          <IconButton
            onClick={increaseQuantity}
            size="small"
            sx={{
              width: {
                xs: 25,
                sm: 28,
              },

              height: {
                xs: 25,
                sm: 28,
              },

              p: 0,

              border: "1px solid #D7DED8",

              borderRadius: 0,

              color: "#2E7D32",

              "&:hover": {
                bgcolor: "#E8F5E9",
              },
            }}
          >
            <Add
              sx={{
                fontSize: {
                  xs: 14,
                  sm: 16,
                },
              }}
            />
          </IconButton>

          {/* SPACE */}

          <Box
            sx={{
              flex: 1,
            }}
          />

          {/* DELETE */}

          <IconButton
            onClick={() =>
              removeItem(item.product._id)
            }
            size="small"
            aria-label="Remove product"
            sx={{
              width: {
                xs: 27,
                sm: 30,
              },

              height: {
                xs: 27,
                sm: 30,
              },

              p: 0,

              borderRadius: 0,

              color: "#C62828",

              "&:hover": {
                bgcolor: "#FDECEC",
              },
            }}
          >
            <DeleteOutline
              sx={{
                fontSize: {
                  xs: 18,
                  sm: 20,
                },
              }}
            />
          </IconButton>
        </Stack>

        {/* =================================================
            SUBTOTAL
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 0.7,
              sm: 1,
            },

            pt: {
              xs: 0.6,
              sm: 0.8,
            },

            borderTop:
              "1px solid #EDF0ED",
          }}
        >
          <Typography
            sx={{
              color: "#444",

              fontWeight: 600,

              fontSize: {
                xs: "0.6rem",
                sm: "0.68rem",
                md: "0.75rem",
              },
            }}
          >
            Subtotal:{" "}
            <Box
              component="span"
              sx={{
                color: "#1B5E20",
                fontWeight: 700,
              }}
            >
              ₹{subtotal}
            </Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;