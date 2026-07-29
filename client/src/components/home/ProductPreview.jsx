import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import { getProducts } from "../../services/product.service";

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.message || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: "#F8F9FA",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
        >
          Featured Products
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mt: 2, mb: 6 }}
        >
          Discover our premium Ayurvedic and herbal wellness products.
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography align="center">
            No products available.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {products.slice(0, 6).map((product) => {
              const imageUrl =
                product.images?.length > 0
                  ? `src={getImageUrl(product.images[0])}`
                  : "https://via.placeholder.com/400x300";

              return (
                <Grid
                  key={product._id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 2,
                  }}
                >
                  <Card
                    sx={{
                      height: 380,
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "column",
                      transition: ".3s",
                      boxShadow: 3,
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={product.productName}
                      sx={{
                        height: 220,
                        objectFit: "contain",
                        bgcolor: "#fafafa",
                        p: 2,
                      }}
                    />

                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        sx={{
                          height: 48,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.productName}
                      </Typography>

                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight={700}
                        sx={{ mt: 1 }}
                      >
                        ₹{product.sellingPrice}
                      </Typography>

                      <Box sx={{ flexGrow: 1 }} />

                      <Button
                        component={Link}
                        to={`/products/${product._id}`}
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box
          sx={{
            mt: 7,
            textAlign: "center",
          }}
        >
          <Button
            component={Link}
            to="/products"
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 3,
              px: 5,
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductPreview;