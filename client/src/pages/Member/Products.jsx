import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import { getProducts } from "../../services/product.service";
import { useCart } from "../../context/CartContext";

import ProductSearch from "../../components/products/ProductSearch";

import { getImageUrl } from "../../utils/imageUrl";


const Products = () => {

  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);


  const loadProducts = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getProducts();

      setProducts(data || []);

    } catch (err) {

      console.error(
        "Products loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load products."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {

    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) => {

      return (
        product.productName
          ?.toLowerCase()
          .includes(search) ||

        product.category
          ?.toLowerCase()
          .includes(search) ||

        product.brand
          ?.toLowerCase()
          .includes(search)
      );

    });

  }, [products, searchTerm]);


  // =====================================================
  // CLOSE SNACKBAR
  // =====================================================

  const handleCloseSnackbar = () => {

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));

  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (product) => {

    try {

      const result =
        await addToCart(product._id);

      if (result === false) {

        setSnackbar({
          open: true,
          severity: "error",
          message:
            "Unable to add product to cart.",
        });

        return;
      }

      setSnackbar({
        open: true,
        severity: "success",
        message:
          `${product.productName} added to cart successfully.`,
      });

    } catch (err) {

      console.error(
        "Add to cart error:",
        err
      );

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to add product to cart.",
      });

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "60vh",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >

      <Container
        maxWidth={false}
        sx={{
          width: "100%",

          maxWidth: "1600px",

          mx: "auto",

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          py: 3,
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Box sx={{ mb: 3 }}>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2rem",
              },
            }}
          >
            Products
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Browse our products and shop what you need.
          </Typography>

        </Box>


        {/* =================================================
            SEARCH
        ================================================= */}

        <Box
          sx={{
            mb: 4,
            width: "100%",
          }}
        >

          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

        </Box>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Card
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
            }}
          >

            <Typography color="error">
              {error}
            </Typography>

          </Card>

        )}


        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {!error &&
          filteredProducts.length === 0 && (

            <Card
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
              }}
            >

              <Typography
                variant="h6"
                color="text.secondary"
              >
                {searchTerm
                  ? "No products found."
                  : "No products available."}
              </Typography>

            </Card>

        )}


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {!error &&
          filteredProducts.length > 0 && (

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",

                gap: 3,

                width: "100%",

                "@media (max-width: 1200px)": {
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                },

                "@media (max-width: 900px)": {
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                },

                "@media (max-width: 600px)": {
                  gridTemplateColumns: "1fr",
                  gap: 2,
                },
              }}
            >

              {filteredProducts.map(
                (product) => {

                  // =======================================
                  // IMAGE
                  // =======================================

                  const image =
                    product.images?.length
                      ? getImageUrl(
                          product.images[0]
                        )
                      : "/images/no-image.png";


                  return (

                    <Card
                      key={product._id}
                      sx={{
                        width: "100%",

                        height: "100%",

                        minWidth: 0,

                        display: "flex",

                        flexDirection:
                          "column",

                        borderRadius: 3,

                        overflow: "hidden",

                        border: "1px solid",

                        borderColor:
                          "divider",

                        backgroundColor:
                          "#ffffff",

                        transition:
                          "transform 0.2s ease, box-shadow 0.2s ease",

                        "&:hover": {
                          transform:
                            "translateY(-4px)",

                          boxShadow: 5,
                        },
                      }}
                    >

                      {/* =================================
                          IMAGE
                      ================================== */}

                      <Box
                        sx={{
                          width: "100%",

                          aspectRatio:
                            "1 / 1",

                          overflow:
                            "hidden",

                          backgroundColor:
                            "#f5f5f5",
                        }}
                      >

                        <CardMedia
                          component="img"

                          image={image}

                          alt={
                            product.productName ||
                            "Product"
                          }

                          sx={{
                            width:
                              "100%",

                            height:
                              "100%",

                            objectFit:
                              "cover",

                            transition:
                              "transform 0.3s ease",

                            "&:hover": {
                              transform:
                                "scale(1.03)",
                            },
                          }}
                        />

                      </Box>


                      {/* =================================
                          CONTENT
                      ================================== */}

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          p: 2,
                        }}
                      >

                        {/* CATEGORY */}

                        <Box
                          sx={{
                            mb: 1.2,
                          }}
                        >

                          <Chip
                            label={
                              product.category ||
                              "Product"
                            }

                            color="success"

                            size="small"

                            sx={{
                              maxWidth:
                                "100%",

                              "& .MuiChip-label":
                                {
                                  overflow:
                                    "hidden",

                                  textOverflow:
                                    "ellipsis",

                                  whiteSpace:
                                    "nowrap",
                                },
                            }}
                          />

                        </Box>


                        {/* PRODUCT NAME */}

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            fontSize:
                              "1rem",

                            lineHeight:
                              1.5,

                            display:
                              "-webkit-box",

                            WebkitLineClamp:
                              2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",

                            minHeight:
                              "48px",
                          }}
                        >
                          {product.productName}
                        </Typography>


                        {/* BRAND */}

                        {product.brand && (

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                            }}
                          >
                            {product.brand}
                          </Typography>

                        )}


                        {/* DESCRIPTION */}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,

                            lineHeight:
                              1.5,

                            display:
                              "-webkit-box",

                            WebkitLineClamp:
                              2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",

                            minHeight:
                              "42px",
                          }}
                        >
                          {product.description ||
                            "No description available."}
                        </Typography>


                        {/* PRICE */}

                        <Typography
                          variant="h6"
                          color="success.main"
                          fontWeight={800}
                          sx={{
                            mt: 1.5,

                            fontSize:
                              "1.35rem",
                          }}
                        >
                          ₹
                          {Number(
                            product.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </Typography>

                      </CardContent>


                      {/* =================================
                          BUTTONS
                      ================================== */}

                      <Box
                        sx={{
                          px: 2,
                          pb: 2,
                        }}
                      >

                        <Stack spacing={1}>

                          {/* =================================
                              VIEW DETAILS
                          ================================== */}

                          <Button
                            component={Link}

                            to={`/products/${product._id}`}

                            variant="outlined"

                            color="success"

                            fullWidth

                            sx={{
                              textTransform:
                                "none",

                              borderRadius:
                                2,
                            }}
                          >
                            View Details
                          </Button>


                          {/* =================================
                              ADD TO CART
                          ================================== */}

                          <Button
                            variant="contained"

                            color="success"

                            fullWidth

                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }

                            sx={{
                              textTransform:
                                "none",

                              borderRadius:
                                2,
                            }}
                          >
                            Add to Cart
                          </Button>

                        </Stack>

                      </Box>

                    </Card>

                  );

                }
              )}

            </Box>

        )}

      </Container>


      {/* ===================================================
          SNACKBAR
      =================================================== */}

      <Snackbar
        open={snackbar.open}

        autoHideDuration={3000}

        onClose={
          handleCloseSnackbar
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >

        <Alert
          severity={
            snackbar.severity
          }

          variant="filled"

          onClose={
            handleCloseSnackbar
          }

          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default Products;