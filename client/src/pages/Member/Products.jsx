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
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { Link } from "react-router-dom";

import { getProducts } from "../../services/product.service";
import { getCategories } from "../../services/category.service";
import { useCart } from "../../context/CartContext";
import ProductSearch from "../../components/products/ProductSearch";
import { getImageUrl } from "../../utils/imageUrl";

// =====================================================
// CATEGORY HELPERS
// =====================================================

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getCategoryName = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return value.name || "";
  }

  return String(value);
};

const unwrapArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.categories)) return response.categories;

  return [];
};

// =====================================================
// MEMBER PRODUCTS
// =====================================================

const Products = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [expandedParent, setExpandedParent] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // =====================================================
  // LOAD PRODUCTS AND CATEGORIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        if (mounted) {
          setProducts(unwrapArray(response));
        }
      } catch (err) {
        console.error("Member products loading error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const loadCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError("");

        const response = await getCategories();

        if (mounted) {
          setCategories(unwrapArray(response));
        }
      } catch (err) {
        console.error("Member categories loading error:", err);

        if (mounted) {
          setCategoryError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load categories."
          );
        }
      } finally {
        if (mounted) {
          setCategoryLoading(false);
        }
      }
    };

    loadProducts();
    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // PARENT CATEGORIES
  // =====================================================

  const parentCategories = useMemo(() => {
    return categories.filter(
      (category) => !getId(category.parentCategory)
    );
  }, [categories]);

  // =====================================================
  // CHILD CATEGORIES
  // =====================================================

  const childCategories = useMemo(() => {
    if (!expandedParent) return [];

    return categories.filter(
      (category) =>
        getId(category.parentCategory) === expandedParent
    );
  }, [categories, expandedParent]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const min =
      minPrice === "" ? null : Number(minPrice);

    const max =
      maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const productName = String(
        product?.productName || ""
      ).toLowerCase();

      const brand = String(
        product?.brand || ""
      ).toLowerCase();

      const description = String(
        product?.description || ""
      ).toLowerCase();

      const categoryName = getCategoryName(
        product?.category
      ).toLowerCase();

      // SEARCH
      const matchesSearch =
        !search ||
        productName.includes(search) ||
        categoryName.includes(search) ||
        brand.includes(search) ||
        description.includes(search);

      if (!matchesSearch) return false;

      // PARENT CATEGORY
      if (selectedParent) {
        const selectedCategory = parentCategories.find(
          (category) => getId(category) === selectedParent
        );

        const productParentId = getId(
          product?.parentCategory
        );

        const matchesParent =
          productParentId === selectedParent ||
          getId(product?.category) === selectedParent ||
          (
            !productParentId &&
            selectedCategory?.name &&
            categoryName ===
              selectedCategory.name.toLowerCase()
          );

        if (!matchesParent) return false;
      }

      // SUBCATEGORY
      if (selectedChild) {
        const productCategoryIds = [
          ...(Array.isArray(product?.categories)
            ? product.categories
            : []),
          product?.category,
          product?.subCategory,
          product?.subcategory,
        ].map(getId);

        if (!productCategoryIds.includes(selectedChild)) {
          return false;
        }
      }

      // PRICE
      const price = Number(product?.price ?? 0);

      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      return true;
    });
  }, [
    products,
    searchTerm,
    selectedParent,
    selectedChild,
    minPrice,
    maxPrice,
    parentCategories,
  ]);

  // =====================================================
  // SELECT PARENT CATEGORY
  // =====================================================

  const handleParentClick = (parentId) => {
    if (expandedParent === parentId) {
      setExpandedParent("");
      setSelectedParent("");
      setSelectedChild("");
      return;
    }

    setExpandedParent(parentId);
    setSelectedParent(parentId);
    setSelectedChild("");
  };

  // =====================================================
  // SELECT SUBCATEGORY
  // =====================================================

  const handleChildClick = (childId) => {
    setSelectedChild((previous) =>
      previous === childId ? "" : childId
    );
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedParent("");
    setSelectedChild("");
    setExpandedParent("");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters =
    searchTerm.trim() !== "" ||
    selectedParent !== "" ||
    selectedChild !== "" ||
    minPrice !== "" ||
    maxPrice !== "";

  // =====================================================
  // CART NOTIFICATIONS
  // =====================================================

  const handleCloseSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product._id);

      if (result === false) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Unable to add product to cart.",
        });

        return;
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: `${product.productName} added to cart successfully.`,
      });
    } catch (err) {
      console.error("Add to cart error:", err);

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

  const invalidPriceRange =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: "100vh",
        m: 0,
        p: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
        bgcolor: "#F5F7FA",

        "& .MuiCard-root, & .MuiPaper-root, & .MuiButton-root, & .MuiChip-root, & .MuiAlert-root":
          {
            borderRadius: "0 !important",
          },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            md: "1600px",
          },
          minWidth: 0,
          mx: {
            xs: 0,
            md: "auto",
          },
          p: {
            xs: "8px 8px 16px",
            sm: "12px 12px 20px",
            md: "18px 20px 24px",
          },
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* PAGE HEADING */}

        <Box sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}>
          <Typography
            component="h1"
            sx={{
              m: 0,
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
              mt: "2px",
              fontSize: {
                xs: "10px",
                sm: "12px",
                md: "13px",
              },
              lineHeight: 1.4,
              color: "text.secondary",
            }}
          >
            Browse products by category and shop what you need.
          </Typography>
        </Box>

        {/* SEARCH */}

        <Box
          sx={{
            width: "100%",
            mb: { xs: 1, sm: 1.5, md: 2 },
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

        {/* CATEGORY AND PRICE FILTERS */}

        <Box
          sx={{
            width: "100%",
            bgcolor: "#FFFFFF",
            border: "1px solid #E0E0E0",
            p: {
              xs: 1.25,
              sm: 2,
              md: 2.5,
            },
            mb: {
              xs: 1.5,
              sm: 2,
            },
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1,
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 14,
                  sm: 16,
                },
                fontWeight: 700,
              }}
            >
              Browse Categories
            </Typography>

            <Button
              size="small"
              color="success"
              startIcon={<RestartAltIcon />}
              onClick={clearFilters}
              sx={{
                textTransform: "none",
                alignSelf: {
                  xs: "flex-end",
                  sm: "auto",
                },
              }}
            >
              Reset Filters
            </Button>
          </Box>

          {categoryLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
              }}
            >
              <CircularProgress
                size={18}
                color="success"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Loading categories...
              </Typography>
            </Box>
          ) : categoryError ? (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              {categoryError}
            </Alert>
          ) : parentCategories.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No categories available.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1,
              }}
            >
              {parentCategories.map((category) => {
                const id = getId(category);
                const selected = selectedParent === id;

                return (
                  <Button
                    key={id}
                    variant={
                      selected ? "contained" : "outlined"
                    }
                    color="success"
                    onClick={() => handleParentClick(id)}
                    endIcon={
                      expandedParent === id ? (
                        <ExpandMoreIcon />
                      ) : (
                        <ChevronRightIcon />
                      )
                    }
                    sx={{
                      minWidth: 0,
                      minHeight: {
                        xs: 38,
                        sm: 42,
                      },
                      justifyContent: "space-between",
                      textAlign: "left",
                      textTransform: "none",
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      px: {
                        xs: 1,
                        sm: 1.5,
                      },
                      overflowWrap: "anywhere",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {category.name || "Category"}
                    </Box>
                  </Button>
                );
              })}
            </Box>
          )}

          {/* SUBCATEGORIES */}

          {expandedParent &&
            childCategories.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Subcategories
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {childCategories.map((category) => {
                    const id = getId(category);

                    return (
                      <Chip
                        key={id}
                        label={category.name || "Subcategory"}
                        clickable
                        color={
                          selectedChild === id
                            ? "success"
                            : "default"
                        }
                        variant={
                          selectedChild === id
                            ? "filled"
                            : "outlined"
                        }
                        onClick={() => handleChildClick(id)}
                        sx={{
                          maxWidth: "100%",
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </>
            )}

          <Divider sx={{ my: 2 }} />

          {/* PRICE FILTER */}

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              mb: 1.25,
            }}
          >
            Filter by Price
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 220px))",
              },
              gap: 1.25,
            }}
          >
            <TextField
              label="Minimum Price (₹)"
              type="number"
              size="small"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(event.target.value)
              }
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              label="Maximum Price (₹)"
              type="number"
              size="small"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Box>

          {invalidPriceRange && (
            <Typography
              color="error"
              variant="caption"
              display="block"
              mt={1}
            >
              Minimum price cannot be greater than maximum price.
            </Typography>
          )}

          <Typography
            sx={{
              mt: 1.5,
              fontSize: {
                xs: 11,
                sm: 12,
              },
              color: "text.secondary",
            }}
          >
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </Typography>
        </Box>

        {/* LOADING */}

        {loading && (
          <Box
            sx={{
              minHeight: "35vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="success" />
          </Box>
        )}

        {/* PRODUCT ERROR */}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}

        {/* EMPTY RESULTS */}

        {!loading &&
          !error &&
          !invalidPriceRange &&
          filteredProducts.length === 0 && (
            <Box
              sx={{
                width: "100%",
                minHeight: 130,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                p: 2,
                boxSizing: "border-box",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 12,
                    sm: 14,
                  },
                  fontWeight: 600,
                }}
              >
                No products found.
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                  fontSize: 12,
                }}
              >
                Try changing your search or filters.
              </Typography>

              {hasFilters && (
                <Button
                  onClick={clearFilters}
                  color="success"
                  sx={{
                    mt: 1,
                    textTransform: "none",
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Box>
          )}

        {/* PRODUCT GRID */}

        {!loading &&
          !error &&
          !invalidPriceRange &&
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
                const image = product.images?.length
                  ? getImageUrl(product.images[0])
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
                      border: "1px solid #E0E0E0",
                      bgcolor: "#FFFFFF",
                      boxShadow: "none",
                      transition: "border-color 0.2s ease",
                      "&:hover": {
                        borderColor: "#2E7D32",
                      },
                    }}
                  >
                    {/* PRODUCT IMAGE */}

                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        overflow: "hidden",
                        bgcolor: "#F5F5F5",
                        flexShrink: 0,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image}
                        alt={product.productName || "Product"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "/images/no-image.png";
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>

                    {/* PRODUCT INFORMATION */}

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
                            getCategoryName(product.category) ||
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
                            fontSize: {
                              xs: "8px",
                              sm: "9px",
                            },
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              px: {
                                xs: 0.6,
                                sm: 0.8,
                              },
                            },
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "12px",
                            md: "14px",
                          },
                          lineHeight: 1.3,
                          fontWeight: 700,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: {
                            xs: "29px",
                            sm: "32px",
                            md: "36px",
                          },
                        }}
                      >
                        {product.productName || "Unnamed product"}
                      </Typography>

                      {product.brand && (
                        <Typography
                          sx={{
                            mt: "3px",
                            fontSize: {
                              xs: "9px",
                              sm: "10px",
                            },
                            lineHeight: 1.3,
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.brand}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          mt: {
                            xs: "4px",
                            sm: "5px",
                          },
                          fontSize: {
                            xs: "8px",
                            sm: "9px",
                            md: "11px",
                          },
                          lineHeight: 1.35,
                          color: "text.secondary",
                          display: {
                            xs: "none",
                            sm: "-webkit-box",
                          },
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description ||
                          "No description available."}
                      </Typography>

                      <Typography
                        sx={{
                          mt: {
                            xs: "6px",
                            sm: "7px",
                          },
                          fontSize: {
                            xs: "13px",
                            sm: "15px",
                            md: "17px",
                          },
                          lineHeight: 1.2,
                          color: "success.main",
                          fontWeight: 800,
                        }}
                      >
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString("en-IN")}
                      </Typography>
                    </CardContent>

                    {/* PRODUCT ACTIONS */}

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
                            textTransform: "none",
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

                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={() =>
                            handleAddToCart(product)
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
                            textTransform: "none",
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

      {/* CART NOTIFICATION */}

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