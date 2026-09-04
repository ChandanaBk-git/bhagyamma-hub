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

  const [products, setProducts] =
    useState([]);

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

      const data =
        await getProducts();

      setProducts(
        data || []
      );

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

  const filteredProducts =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return products;
      }

      return products.filter(
        (product) => {

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

        }
      );

    }, [
      products,
      searchTerm,
    ]);


  // =====================================================
  // CLOSE SNACKBAR
  // =====================================================

  const handleCloseSnackbar =
    () => {

      setSnackbar(
        (prev) => ({
          ...prev,
          open: false,
        })
      );

    };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart =
    async (product) => {

      try {

        const result =
          await addToCart(
            product._id
          );


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

          justifyContent:
            "center",

          alignItems:
            "center",

          margin: 0,

          padding: 0,
        }}
      >

        <CircularProgress
          color="success"
        />

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

        boxSizing:
          "border-box",

        overflowX:
          "hidden",

        backgroundColor:
          "#F5F7FA",

        minHeight:
          "100vh",

        borderRadius: 0,
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
            sm: 0,
            md: "0 auto",
          },

          padding: {
            xs: "10px 8px 20px",
            sm: "14px 14px 24px",
            md: "24px",
          },

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
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
              xs: 1.5,
              sm: 2,
              md: 3,
            },
          }}
        >

          <Typography
            component="h1"
            sx={{
              margin: 0,

              fontSize: {
                xs: "20px",
                sm: "24px",
                md: "30px",
              },

              lineHeight: {
                xs: "25px",
                sm: "30px",
                md: "36px",
              },

              fontWeight: 700,

              color: "#292929",
            }}
          >
            Products
          </Typography>


          <Typography
            sx={{
              marginTop: {
                xs: "3px",
                sm: "5px",
              },

              fontSize: {
                xs: "11px",
                sm: "13px",
                md: "14px",
              },

              lineHeight: 1.5,

              color:
                "text.secondary",
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

            padding: 0,

            mb: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },

            boxSizing:
              "border-box",

            overflow:
              "hidden",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing:
                "border-box",
            },
          }}
        >

          <ProductSearch
            searchTerm={
              searchTerm
            }

            setSearchTerm={
              setSearchTerm
            }
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

              mb: 2,

              padding: 0,
            }}
          >

            <Alert
              severity="error"
              sx={{
                width: "100%",

                boxSizing:
                  "border-box",

                borderRadius: 0,

                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },
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

                minHeight: "160px",

                display: "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                textAlign:
                  "center",

                backgroundColor:
                  "#FFFFFF",

                border:
                  "1px solid #E0E0E0",

                borderRadius: 0,

                boxSizing:
                  "border-box",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                  },

                  color:
                    "text.secondary",
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

                boxSizing:
                  "border-box",

                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",

                gap: {
                  xs: 1,
                  sm: 1.5,
                  md: 2.5,
                },

                "@media (max-width: 1200px)": {
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                },

                "@media (max-width: 900px)": {
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                },

                "@media (max-width: 600px)": {
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap: "8px",
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
                      key={
                        product._id
                      }

                      elevation={0}

                      sx={{
                        width: "100%",

                        minWidth: 0,

                        height: "100%",

                        display: "flex",

                        flexDirection:
                          "column",

                        overflow:
                          "hidden",

                        boxSizing:
                          "border-box",

                        border:
                          "1px solid #E0E0E0",

                        borderRadius: 0,

                        backgroundColor:
                          "#FFFFFF",

                        boxShadow:
                          "none",

                        transition:
                          "box-shadow 0.2s ease",

                        "&:hover": {
                          boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)",
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
                            width:
                              "100%",

                            height:
                              "100%",

                            objectFit:
                              "cover",

                            display:
                              "block",
                          }}
                        />

                      </Box>


                      {/* =================================
                          CONTENT
                      ================================== */}

                      <CardContent
                        sx={{
                          flexGrow: 1,

                          minWidth: 0,

                          padding: {
                            xs: "8px",
                            sm: "12px",
                            md: "16px",
                          },

                          "&:last-child": {
                            paddingBottom: {
                              xs: "8px",
                              sm: "12px",
                              md: "16px",
                            },
                          },
                        }}
                      >


                        {/* CATEGORY */}

                        <Box
                          sx={{
                            mb: {
                              xs: 0.5,
                              sm: 1,
                            },

                            maxWidth:
                              "100%",
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

                              height: {
                                xs: "21px",
                                sm: "24px",
                              },

                              borderRadius: 1,

                              fontSize: {
                                xs: "9px",
                                sm: "11px",
                              },

                              "& .MuiChip-label":
                                {
                                  overflow:
                                    "hidden",

                                  textOverflow:
                                    "ellipsis",

                                  whiteSpace:
                                    "nowrap",

                                  px: {
                                    xs: 0.7,
                                    sm: 1,
                                  },
                                },
                            }}
                          />

                        </Box>


                        {/* PRODUCT NAME */}

                        <Typography
                          sx={{
                            fontSize: {
                              xs: "12px",
                              sm: "14px",
                              md: "16px",
                            },

                            lineHeight:
                              1.35,

                            fontWeight: 700,

                            display:
                              "-webkit-box",

                            WebkitLineClamp:
                              2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",

                            minHeight: {
                              xs: "32px",
                              sm: "38px",
                              md: "43px",
                            },
                          }}
                        >
                          {
                            product.productName
                          }
                        </Typography>


                        {/* BRAND */}

                        {product.brand && (

                          <Typography
                            sx={{
                              marginTop: {
                                xs: "3px",
                                sm: "5px",
                              },

                              fontSize: {
                                xs: "10px",
                                sm: "12px",
                              },

                              lineHeight: 1.4,

                              color:
                                "text.secondary",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              product.brand
                            }
                          </Typography>

                        )}


                        {/* DESCRIPTION */}

                        <Typography
                          sx={{
                            marginTop: {
                              xs: "5px",
                              sm: "8px",
                            },

                            fontSize: {
                              xs: "9px",
                              sm: "11px",
                              md: "13px",
                            },

                            lineHeight:
                              1.4,

                            color:
                              "text.secondary",

                            display:
                              {
                                xs: "none",
                                sm: "-webkit-box",
                              },

                            WebkitLineClamp:
                              2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",
                          }}
                        >
                          {
                            product.description ||
                            "No description available."
                          }
                        </Typography>


                        {/* PRICE */}

                        <Typography
                          sx={{
                            marginTop: {
                              xs: "7px",
                              sm: "10px",
                            },

                            fontSize: {
                              xs: "14px",
                              sm: "17px",
                              md: "20px",
                            },

                            lineHeight: 1.2,

                            color:
                              "success.main",

                            fontWeight: 800,
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
                          width: "100%",

                          padding: {
                            xs: "0 8px 8px",
                            sm: "0 12px 12px",
                            md: "0 16px 16px",
                          },

                          boxSizing:
                            "border-box",
                        }}
                      >

                        <Stack
                          spacing={{
                            xs: 0.7,
                            sm: 1,
                          }}
                        >


                          {/* VIEW DETAILS */}

                          <Button
                            component={
                              Link
                            }

                            to={`/products/${product._id}`}

                            variant="outlined"

                            color="success"

                            fullWidth

                            sx={{
                              minHeight: {
                                xs: "30px",
                                sm: "36px",
                              },

                              padding:
                                {
                                  xs: "3px 5px",
                                  sm: "5px 8px",
                                },

                              textTransform:
                                "none",

                              borderRadius: 1,

                              fontSize: {
                                xs: "10px",
                                sm: "12px",
                              },

                              lineHeight: 1.2,
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
                                xs: "30px",
                                sm: "36px",
                              },

                              padding:
                                {
                                  xs: "3px 5px",
                                  sm: "5px 8px",
                                },

                              textTransform:
                                "none",

                              borderRadius: 1,

                              fontSize: {
                                xs: "10px",
                                sm: "12px",
                              },

                              lineHeight: 1.2,
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

      </Box>


      {/* ===================================================
          SNACKBAR
      =================================================== */}

      <Snackbar
        open={
          snackbar.open
        }

        autoHideDuration={
          3000
        }

        onClose={
          handleCloseSnackbar
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
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

            borderRadius: 1,

            fontSize: {
              xs: "11px",
              sm: "13px",
            },
          }}
        >
          {
            snackbar.message
          }
        </Alert>

      </Snackbar>

    </Box>

  );

};


export default Products;