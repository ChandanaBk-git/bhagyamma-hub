import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import { getProducts } from "../../services/product.service";
import { getImageUrl } from "../../utils/imageUrl";

const FALLBACK_IMAGE = "/images/no-image.png";

// =====================================================
// PRODUCT PREVIEW
// =====================================================

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        console.log("HOME PRODUCTS RESPONSE:", data);

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("HOME PRODUCTS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load products."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          bgcolor: "#fff",
          py: {
            xs: 3,
            sm: 5,
            md: 8,
          },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            align="center"
            fontWeight={700}
            color="primary"
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.7rem",
                md: "2.4rem",
              },
            }}
          >
            Featured Products
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress
              color="success"
              size={28}
            />
          </Box>
        </Container>
      </Box>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",

        py: {
          xs: 3,
          sm: 5,
          md: 8,
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Typography
          align="center"
          fontWeight={700}
          color="primary"
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.75rem",
              md: "2.5rem",
            },

            lineHeight: 1.2,
          }}
        >
          Featured Products
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mt: 0.5,

            mb: {
              xs: 2,
              sm: 3,
              md: 5,
            },

            fontSize: {
              xs: "0.68rem",
              sm: "0.85rem",
              md: "0.98rem",
            },

            lineHeight: 1.45,
          }}
        >
          Discover our premium Ayurvedic and herbal wellness products.
        </Typography>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Typography
            align="center"
            color="error"
            sx={{
              mb: 2,
              fontSize: "0.75rem",
            }}
          >
            {error}
          </Typography>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!error && products.length === 0 && (
          <Typography
            align="center"
            color="text.secondary"
            sx={{
              fontSize: "0.8rem",
            }}
          >
            No products available.
          </Typography>
        )}

        {/* =================================================
            SIX PRODUCTS
            2 PER ROW ON MOBILE
        ================================================= */}

        {products.length > 0 && (
          <Grid
            container
            spacing={{
              xs: 1.2,
              sm: 2,
              md: 3,
            }}
          >
            {products.slice(0, 4).map((product) => {
              const rawImage =
                product?.images?.[0] || "";

              const imageUrl =
                getImageUrl(rawImage);

              return (
                <Grid
                  key={product?._id}
                  size={{
                    xs: 6,
                    sm: 6,
                    md: 4,
                    lg: 2,
                  }}
                  sx={{
                    display: "flex",
                  }}
                >
                  {/* =================================================
                      PRODUCT CARD
                  ================================================= */}

                  <Card
                    elevation={0}
                    sx={{
                      width: "100%",

                      /*
                       * COMPACT CARD HEIGHT
                       */
                      height: {
                        xs: "300px",
                        sm: "350px",
                        md: "400px",
                        lg: "410px",
                      },

                      borderRadius: 0,

                      border:
                        "1px solid #E1E5E8",

                      bgcolor: "#fff",

                      overflow: "hidden",

                      display: "flex",

                      flexDirection: "column",

                      boxShadow: "none",

                      "&:hover": {
                        borderColor: "#A9CFAF",

                        boxShadow:
                          "0 3px 10px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <Box
                      sx={{
                        width: "100%",

                        /*
                         * SMALLER IMAGE AREA
                         */

                        height: {
                          xs: "112px",
                          sm: "140px",
                          md: "170px",
                          lg: "175px",
                        },

                        flexShrink: 0,

                        bgcolor: "#fff",

                        borderBottom:
                          "1px solid #EEEEEE",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        overflow: "hidden",

                        p: {
                          xs: 0.5,
                          sm: 0.8,
                          md: 1,
                        },

                        boxSizing: "border-box",
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={imageUrl}
                        alt={
                          product?.productName ||
                          "Product"
                        }
                        onError={(event) => {
                          if (
                            event.currentTarget.src.endsWith(
                              FALLBACK_IMAGE
                            )
                          ) {
                            return;
                          }

                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                        sx={{
                          width: "100%",

                          height: "100%",

                          /*
                           * COMPLETE IMAGE
                           */
                          objectFit: "contain",

                          objectPosition:
                            "center",

                          display: "block",
                        }}
                      />
                    </Box>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <CardContent
                      sx={{
                        flex: 1,

                        minHeight: 0,

                        display: "flex",

                        flexDirection: "column",

                        p: {
                          xs: 0.9,
                          sm: 1.2,
                          md: 1.7,
                        },

                        "&:last-child": {
                          pb: {
                            xs: 0.9,
                            sm: 1.2,
                            md: 1.7,
                          },
                        },
                      }}
                    >
                      {/* =================================================
                          CATEGORY
                      ================================================= */}

                      <Box
                        sx={{
                          height: {
                            xs: "18px",
                            sm: "21px",
                            md: "23px",
                          },

                          mb: {
                            xs: 0.3,
                            sm: 0.5,
                            md: 0.7,
                          },

                          display: "flex",

                          alignItems:
                            "flex-start",

                          overflow: "hidden",
                        }}
                      >
                        {product?.category && (
                          <Chip
                            label={product.category}
                            size="small"
                            color="success"
                            sx={{
                              height: {
                                xs: "17px",
                                sm: "19px",
                                md: "21px",
                              },

                              maxWidth:
                                "100%",

                              fontSize: {
                                xs: "0.42rem",
                                sm: "0.52rem",
                                md: "0.62rem",
                              },

                              fontWeight: 600,

                              "& .MuiChip-label":
                                {
                                  px: {
                                    xs: 0.6,
                                    sm: 0.8,
                                  },
                                },
                            }}
                          />
                        )}
                      </Box>

                      {/* =================================================
                          PRODUCT NAME
                      ================================================= */}

                      <Box
                        sx={{
                          height: {
                            xs: "32px",
                            sm: "36px",
                            md: "42px",
                          },

                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          component="h3"
                          fontWeight={700}
                          sx={{
                            margin: 0,

                            color: "#222",

                            fontSize: {
                              xs: "0.63rem",
                              sm: "0.74rem",
                              md: "0.9rem",
                            },

                            lineHeight: {
                              xs: 1.25,
                              sm: 1.3,
                              md: 1.35,
                            },

                            display:
                              "-webkit-box",

                            WebkitLineClamp: 2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",

                            wordBreak:
                              "break-word",
                          }}
                        >
                          {product?.productName}
                        </Typography>
                      </Box>

                      {/* =================================================
                          BRAND
                      ================================================= */}

                      <Box
                        sx={{
                          height: {
                            xs: "16px",
                            sm: "18px",
                            md: "20px",
                          },

                          overflow: "hidden",
                        }}
                      >
                        {product?.brand && (
                          <Typography
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: "0.47rem",
                                sm: "0.56rem",
                                md: "0.68rem",
                              },

                              lineHeight: 1.25,

                              whiteSpace:
                                "nowrap",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {product.brand}
                          </Typography>
                        )}
                      </Box>

                      {/* =================================================
                          DESCRIPTION
                      ================================================= */}

                      <Box
                        sx={{
                          height: {
                            xs: "30px",
                            sm: "36px",
                            md: "44px",
                          },

                          mt: {
                            xs: 0.2,
                            sm: 0.4,
                            md: 0.6,
                          },

                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          sx={{
                            margin: 0,

                            fontSize: {
                              xs: "0.47rem",
                              sm: "0.57rem",
                              md: "0.7rem",
                            },

                            lineHeight: {
                              xs: 1.3,
                              sm: 1.4,
                              md: 1.45,
                            },

                            display:
                              "-webkit-box",

                            /*
                             * Only 2 lines so
                             * cards stay compact.
                             */
                            WebkitLineClamp: 2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",

                            wordBreak:
                              "break-word",
                          }}
                        >
                          {product?.description ||
                            "Premium quality product from Bhagyamma Hub."}
                        </Typography>
                      </Box>

                      {/* =================================================
                          PRICE
                      ================================================= */}

                      <Typography
                        color="success.main"
                        fontWeight={700}
                        sx={{
                          mt: {
                            xs: 0.5,
                            sm: 0.7,
                            md: 1,
                          },

                          fontSize: {
                            xs: "0.72rem",
                            sm: "0.85rem",
                            md: "1.05rem",
                          },

                          lineHeight: 1.2,
                        }}
                      >
                        ₹
                        {product?.sellingPrice ??
                          product?.price ??
                          0}
                      </Typography>

                      {/* =================================================
                          BUTTON
                      ================================================= */}

                      <Box
                        sx={{
                          mt: "auto",

                          pt: {
                            xs: 0.6,
                            sm: 0.8,
                            md: 1.2,
                          },
                        }}
                      >
                        <Button
                          component={Link}
                          to={`/products/${product?._id}`}
                          variant="outlined"
                          color="success"
                          fullWidth
                          sx={{
                            height: {
                              xs: "26px",
                              sm: "30px",
                              md: "36px",
                            },

                            minHeight: {
                              xs: "26px",
                              sm: "30px",
                              md: "36px",
                            },

                            padding: 0,

                            borderRadius: 0,

                            borderWidth:
                              "1px",

                            textTransform:
                              "none",

                            fontWeight: 600,

                            fontSize: {
                              xs: "0.50rem",
                              sm: "0.6rem",
                              md: "0.75rem",
                            },

                            lineHeight: 1,

                            whiteSpace:
                              "nowrap",

                            "&:hover": {
                              borderWidth:
                                "1px",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* =================================================
            VIEW ALL PRODUCTS
        ================================================= */}

        <Stack
          alignItems="center"
          sx={{
            mt: {
              xs: 2.5,
              sm: 3.5,
              md: 5,
            },
          }}
        >
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="success"
            sx={{
              height: {
                xs: "32px",
                sm: "38px",
                md: "44px",
              },

              px: {
                xs: 2.2,
                sm: 3.5,
                md: 5,
              },

              borderRadius: 0,

              textTransform: "none",

              fontWeight: 700,

              fontSize: {
                xs: "0.6rem",
                sm: "0.7rem",
                md: "0.85rem",
              },
            }}
          >
            View All Products
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductPreview;