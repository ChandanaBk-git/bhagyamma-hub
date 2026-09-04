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

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [snackbar, setSnackbar] =
    useState({
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
      searchTerm
        .trim()
        .toLowerCase();

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

  }, [
    products,
    searchTerm,
  ]);


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

          margin: 0,
          padding: 0,
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
        maxWidth: "100%",
        minWidth: 0,

        margin: 0,
        padding: 0,

        boxSizing: "border-box",

        overflowX: "hidden",

        backgroundColor: "#F5F7FA",

        minHeight: "100vh",

        borderRadius: "0 !important",

        "& .MuiCard-root": {
          borderRadius: "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius: "0 !important",
        },

        "& .MuiCardContent-root": {
          borderRadius: "0 !important",
        },

        "& .MuiButton-root": {
          borderRadius: "0 !important",
        },

        "& .MuiChip-root": {
          borderRadius: "0 !important",
        },

        "& .MuiAlert-root": {
          borderRadius: "0 !important",
        },
      }}
    >

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1600px",
          },

          minWidth: 0,

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 16px",
            sm: "12px 12px 20px",
            md: "18px 20px 24px",
          },

          boxSizing: "border-box",

          overflowX: "hidden",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            margin: 0,
            padding: 0,

            mb: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              margin: 0,

              fontSize: {
                xs: "18px",
                sm: "22px",
                md: "27px",
              },

              lineHeight: 1.25,

              fontWeight: 700,

              color: "#292929",
            }}
          >
            Products
          </Typography>

          <Typography
            sx={{
              marginTop: "2px",

              fontSize: {
                xs: "10px",
                sm: "12px",
                md: "13px",
              },

              lineHeight: 1.4,

              color: "text.secondary",
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
            width: "100%",
            margin: 0,

            mb: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },

            boxSizing: "border-box",

            overflow: "hidden",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            },
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
          <Box
            sx={{
              width: "100%",
              margin: 0,

              mb: 1.5,

              padding: 0,
            }}
          >
            <Alert
              severity="error"
              sx={{
                width: "100%",

                boxSizing: "border-box",

                borderRadius: 0,

                fontSize: {
                  xs: "10px",
                  sm: "12px",
                },

                py: 0.75,
              }}
            >
              {error}
            </Alert>
          </Box>
        )}


        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {!error &&
          filteredProducts.length === 0 && (
            <Box
              sx={{
                width: "100%",

                minHeight: "130px",

                display: "flex",

                justifyContent: "center",
                alignItems: "center",

                textAlign: "center",

                backgroundColor: "#FFFFFF",

                border: "1px solid #E0E0E0",

                borderRadius: 0,

                boxSizing: "border-box",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                  },

                  color: "text.secondary",
                }}
              >
                {searchTerm
                  ? "No products found."
                  : "No products available."}
              </Typography>
            </Box>
          )}


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {!error &&
          filteredProducts.length > 0 && (
            <Box
              sx={{
                display: "grid",

                width: "100%",
                maxWidth: "100%",
                minWidth: 0,

                boxSizing: "border-box",

                gridTemplateColumns:
                  "repeat(5, minmax(0, 1fr))",

                gap: {
                  xs: "8px",
                  sm: "10px",
                  md: "14px",
                },

                "@media (max-width: 1200px)": {
                  gridTemplateColumns:
                    "repeat(4, minmax(0, 1fr))",
                },

                "@media (max-width: 900px)": {
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                },

                "@media (max-width: 600px)": {
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap: "8px",
                },
              }}
            >

              {filteredProducts.map((product) => {

                // =========================================
                // IMAGE
                // =========================================

                const image =
                  product.images?.length
                    ? getImageUrl(
                        product.images[0]
                      )
                    : "/images/no-image.png";


                return (
                  <Card
                    key={product._id}

                    elevation={0}

                    sx={{
                      width: "100%",
                      minWidth: 0,
                      height: "100%",

                      display: "flex",
                      flexDirection: "column",

                      overflow: "hidden",

                      boxSizing: "border-box",

                      border:
                        "1px solid #E0E0E0",

                      borderRadius: 0,

                      backgroundColor:
                        "#FFFFFF",

                      boxShadow: "none",

                      transition:
                        "border-color 0.2s ease",

                      "&:hover": {
                        borderColor:
                          "#2E7D32",
                      },
                    }}
                  >

                    {/* ===================================
                        IMAGE
                    ==================================== */}

                    <Box
                      sx={{
                        width: "100%",

                        aspectRatio: "1 / 1",

                        overflow: "hidden",

                        backgroundColor:
                          "#F5F5F5",

                        flexShrink: 0,
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
                          width: "100%",
                          height: "100%",

                          objectFit: "cover",

                          display: "block",
                        }}
                      />
                    </Box>


                    {/* ===================================
                        CONTENT
                    ==================================== */}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        minWidth: 0,

                        p: {
                          xs: "7px",
                          sm: "9px",
                          md: "11px",
                        },

                        "&:last-child": {
                          pb: {
                            xs: "7px",
                            sm: "9px",
                            md: "11px",
                          },
                        },
                      }}
                    >

                      {/* CATEGORY */}

                      <Box
                        sx={{
                          mb: {
                            xs: 0.4,
                            sm: 0.6,
                          },

                          maxWidth: "100%",
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
                            maxWidth: "100%",

                            height: {
                              xs: "19px",
                              sm: "21px",
                            },

                            borderRadius: 0,

                            fontSize: {
                              xs: "8px",
                              sm: "9px",
                            },

                            "& .MuiChip-label": {
                              overflow: "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",

                              px: {
                                xs: 0.6,
                                sm: 0.8,
                              },
                            },
                          }}
                        />
                      </Box>


                      {/* PRODUCT NAME */}

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "12px",
                            md: "14px",
                          },

                          lineHeight: 1.3,

                          fontWeight: 700,

                          display:
                            "-webkit-box",

                          WebkitLineClamp: 2,

                          WebkitBoxOrient:
                            "vertical",

                          overflow: "hidden",

                          minHeight: {
                            xs: "29px",
                            sm: "32px",
                            md: "36px",
                          },
                        }}
                      >
                        {product.productName}
                      </Typography>


                      {/* BRAND */}

                      {product.brand && (
                        <Typography
                          sx={{
                            marginTop: "3px",

                            fontSize: {
                              xs: "9px",
                              sm: "10px",
                            },

                            lineHeight: 1.3,

                            color:
                              "text.secondary",

                            overflow: "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {product.brand}
                        </Typography>
                      )}


                      {/* DESCRIPTION */}

                      <Typography
                        sx={{
                          marginTop: {
                            xs: "4px",
                            sm: "5px",
                          },

                          fontSize: {
                            xs: "8px",
                            sm: "9px",
                            md: "11px",
                          },

                          lineHeight: 1.35,

                          color:
                            "text.secondary",

                          display: {
                            xs: "none",
                            sm: "-webkit-box",
                          },

                          WebkitLineClamp: 2,

                          WebkitBoxOrient:
                            "vertical",

                          overflow: "hidden",
                        }}
                      >
                        {product.description ||
                          "No description available."}
                      </Typography>


                      {/* PRICE */}

                      <Typography
                        sx={{
                          marginTop: {
                            xs: "6px",
                            sm: "7px",
                          },

                          fontSize: {
                            xs: "13px",
                            sm: "15px",
                            md: "17px",
                          },

                          lineHeight: 1.2,

                          color:
                            "success.main",

                          fontWeight: 800,
                        }}
                      >
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>

                    </CardContent>


                    {/* ===================================
                        BUTTONS
                    ==================================== */}

                    <Box
                      sx={{
                        width: "100%",

                        px: {
                          xs: "7px",
                          sm: "9px",
                          md: "11px",
                        },

                        pb: {
                          xs: "7px",
                          sm: "9px",
                          md: "11px",
                        },

                        boxSizing: "border-box",
                      }}
                    >
                      <Stack
                        spacing={{
                          xs: 0.6,
                          sm: 0.75,
                        }}
                      >

                        {/* VIEW DETAILS */}

                        <Button
                          component={Link}

                          to={`/products/${product._id}`}

                          variant="outlined"

                          color="success"

                          fullWidth

                          sx={{
                            minHeight: {
                              xs: "28px",
                              sm: "32px",
                            },

                            p: {
                              xs: "2px 4px",
                              sm: "4px 6px",
                            },

                            textTransform:
                              "none",

                            borderRadius: 0,

                            fontSize: {
                              xs: "9px",
                              sm: "10px",
                            },

                            lineHeight: 1.2,

                            boxShadow: "none",
                          }}
                        >
                          View Details
                        </Button>


                        {/* ADD TO CART */}

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
                            minHeight: {
                              xs: "28px",
                              sm: "32px",
                            },

                            p: {
                              xs: "2px 4px",
                              sm: "4px 6px",
                            },

                            textTransform:
                              "none",

                            borderRadius: 0,

                            fontSize: {
                              xs: "9px",
                              sm: "10px",
                            },

                            lineHeight: 1.2,

                            boxShadow: "none",

                            "&:hover": {
                              boxShadow: "none",
                            },
                          }}
                        >
                          Add to Cart
                        </Button>

                      </Stack>
                    </Box>

                  </Card>
                );
              })}

            </Box>
          )}

      </Box>


      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar
        open={snackbar.open}

        autoHideDuration={3000}

        onClose={handleCloseSnackbar}

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}

          variant="filled"

          onClose={handleCloseSnackbar}

          sx={{
            width: "100%",

            borderRadius:
              "0 !important",

            fontSize: {
              xs: "10px",
              sm: "12px",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};


export default Products;