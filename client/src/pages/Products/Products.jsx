
import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import ProductBanner from "../../components/products/ProductBanner";
import ProductSearch from "../../components/products/ProductSearch";
import ProductGrid from "../../components/products/ProductGrid";

import { getProducts } from "../../services/product.service";
import { getCategories } from "../../services/category.service";

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getName = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return value.name || "";
  }

  return String(value);
};

const Products = () => {
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

  // =====================================================
  // LOAD PRODUCTS AND CATEGORIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setCategoryLoading(true);
        setError("");
        setCategoryError("");

        const [productResult, categoryResult] =
          await Promise.allSettled([
            getProducts(),
            getCategories(),
          ]);

        if (!mounted) return;

        if (productResult.status === "fulfilled") {
          const result = productResult.value;

          setProducts(Array.isArray(result) ? result : []);
        } else {
          throw productResult.reason;
        }

        if (categoryResult.status === "fulfilled") {
          const result = categoryResult.value;

          setCategories(Array.isArray(result) ? result : []);
        } else {
          setCategoryError(
            categoryResult.reason?.message ||
              "Unable to load categories."
          );
        }
      } catch (err) {
        if (!mounted) return;

        console.error("PRODUCT FETCH ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products."
        );
      } finally {
        if (mounted) {
          setLoading(false);
          setCategoryLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // PARENT AND CHILD CATEGORIES
  // =====================================================

  const parentCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        !category.parentCategory ||
        getId(category.parentCategory) === ""
    );
  }, [categories]);

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
      // SEARCH
      const productName =
        product?.productName?.toLowerCase() || "";

      const categoryName =
        product?.category?.toLowerCase() || "";

      const brand =
        product?.brand?.toLowerCase() || "";

      const description =
        product?.description?.toLowerCase() || "";

      const searchMatch =
        !search ||
        productName.includes(search) ||
        categoryName.includes(search) ||
        brand.includes(search) ||
        description.includes(search);

      if (!searchMatch) return false;

      // PARENT CATEGORY
      if (selectedParent) {
        const productParent = getId(product.parentCategory);

        const selectedParentName =
          parentCategories.find(
            (item) => String(item._id) === selectedParent
          )?.name;

        const parentMatch =
          productParent === selectedParent ||
          (
            !productParent &&
            selectedParentName &&
            product.category?.toLowerCase() ===
              selectedParentName.toLowerCase()
          );

        if (!parentMatch) return false;
      }

      // CHILD CATEGORY
      if (selectedChild) {
        const productCategories = Array.isArray(product.categories)
          ? product.categories.map(getId)
          : [];

        if (!productCategories.includes(selectedChild)) {
          return false;
        }
      }

      // PRICE
      const price = Number(product.price);

      if (!Number.isFinite(price)) return false;

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
  // SELECT PARENT
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
  // SELECT CHILD
  // =====================================================

  const handleChildClick = (childId) => {
    setSelectedChild((previous) =>
      previous === childId ? "" : childId
    );
  };

  // =====================================================
  // CLEAR FILTERS
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
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F8FAF8",
      }}
    >
      <ProductBanner />

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          py: {
            xs: 2.5,
            sm: 3.5,
            md: 4.5,
          },
        }}
      >
        {/* SEARCH */}

        <Box
          sx={{
            maxWidth: 650,
            mx: "auto",
            mb: 3,
          }}
        >
          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>

        {/* FILTER SECTION */}

        <Box
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E7ECE7",
            borderRadius: { xs: 2.5, sm: 3 },
            boxShadow: "0 8px 28px rgba(35, 65, 40, 0.045)",
            p: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
            },
            mb: { xs: 2.5, sm: 3 },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            mb={2}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="#263C2B"
            >
              Browse Categories
            </Typography>

            {hasFilters && (
              <Button
                size="small"
                color="inherit"
                startIcon={<RestartAltIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {categoryLoading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} color="success" />
              <Typography variant="body2" color="text.secondary">
                Loading categories...
              </Typography>
            </Box>
          ) : categoryError ? (
            <Alert severity="warning">
              {categoryError}
            </Alert>
          ) : parentCategories.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No categories available.
            </Typography>
          ) : (
            <Box
              sx={{
                display: { xs: "flex", sm: "grid" },
                flexWrap: { xs: "nowrap", sm: "initial" },
                overflowX: { xs: "auto", sm: "visible" },
                overscrollBehaviorX: "contain",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: { xs: "none", sm: "auto" },
                "&::-webkit-scrollbar": { display: { xs: "none", sm: "block" } },
                gridTemplateColumns: {
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1, sm: 1.5 },
                alignItems: "start",
                pb: { xs: 0.5, sm: 0 },
              }}
            >
              {parentCategories.map((parent) => {
                const parentId = String(parent._id);

                const isExpanded =
                  expandedParent === parentId;

                const isSelected =
                  selectedParent === parentId;

                const children = categories.filter(
                  (category) =>
                    getId(category.parentCategory) === parentId
                );

                return (
                  <Box
                    key={parentId}
                    sx={{
                      border: "1px solid",
                      borderColor: isSelected ? "#8AA88D" : "#E5E9E5",
                      borderRadius: 2,
                      overflow: "hidden",
                      minWidth: { xs: 142, sm: 0 },
                      flex: { xs: "0 0 142px", sm: "initial" },
                      transition: "border-color 160ms ease",
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={() => handleParentClick(parentId)}
                      endIcon={
                        isExpanded ? (
                          <ExpandMoreIcon />
                        ) : (
                          <ChevronRightIcon />
                        )
                      }
                      sx={{
                        width: "100%",
                        justifyContent: "space-between",
                        px: { xs: 1, sm: 1.75 },
                        py: { xs: 0.8, sm: 1.5 },
                        minHeight: { xs: 40, sm: 48 },
                        color: "#344238",
                        backgroundColor: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: { xs: "0.72rem", sm: "0.95rem" },
                        lineHeight: 1.2,
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        textTransform: "none",
                        textAlign: "left",
                        "&:hover": { backgroundColor: "#F7F9F7" },
                        "& .MuiButton-endIcon": { ml: 0.4 },
                      }}
                    >
                      {parent.name}
                    </Button>

                    {isExpanded && (
                      <>
                        <Divider />

                        <Box
                          sx={{
                            p: { xs: 1.25, sm: 1.5 },
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                            maxHeight: { xs: 180, sm: 220 },
                            overflowY: "auto",
                            alignContent: "flex-start",
                          }}
                        >
                          <Chip
                            label="All"
                            size="small"
                            clickable
                            color={
                              !selectedChild
                                ? "success"
                                : "default"
                            }
                            variant={
                              !selectedChild
                                ? "filled"
                                : "outlined"
                            }
                            onClick={() => setSelectedChild("")}
                          />

                          {children.map((child) => {
                            const childId = String(child._id);

                            return (
                              <Chip
                                key={childId}
                                label={child.name}
                                size="small"
                                clickable
                                color={
                                  selectedChild === childId
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedChild === childId
                                    ? "filled"
                                    : "outlined"
                                }
                                onClick={() =>
                                  handleChildClick(childId)
                                }
                              />
                            );
                          })}

                          {children.length === 0 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No subcategories yet.
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* PRICE FILTER */}

          <Divider sx={{ my: 2.5 }} />

          <Typography
            fontWeight={700}
            color="#263C2B"
            mb={1.5}
          >
            Filter by Price
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 220px))" },
              alignItems: "start",
              gap: 1.25,
            }}
          >
            <TextField
              label="Minimum Price (₹)"
              type="number"
              size="small"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            />

            <TextField
              label="Maximum Price (₹)"
              type="number"
              size="small"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{
                flex: 1,
                minWidth: 130,
              }}
            />
          </Box>

          {minPrice !== "" &&
            maxPrice !== "" &&
            Number(minPrice) > Number(maxPrice) && (
              <Typography
                color="error"
                variant="caption"
                sx={{ display: "block", mt: 1 }}
              >
                Minimum price cannot be greater than maximum price.
              </Typography>
            )}
        </Box>

        {/* LOADING */}

        {loading && (
          <Box
            sx={{
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <CircularProgress color="success" size={28} />

            <Typography color="text.secondary" variant="body2">
              Loading products...
            </Typography>
          </Box>
        )}

        {/* ERROR */}

        {!loading && error && (
          <Box sx={{ maxWidth: 600, mx: "auto", py: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 0 }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* EMPTY RESULTS */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <Box
              sx={{
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                flexDirection: "column",
              }}
            >
              <Typography fontWeight={700} color="#333">
                No Products Found
              </Typography>

              <Typography
                mt={0.5}
                color="#777"
                variant="body2"
              >
                Try changing your search or filters.
              </Typography>

              {hasFilters && (
                <Button
                  onClick={clearFilters}
                  color="success"
                  sx={{ mt: 1 }}
                >
                  Clear All Filters
                </Button>
              )}
            </Box>
          )}

        {/* PRODUCT COUNT + GRID */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  color="#555"
                  fontSize={{
                    xs: "0.75rem",
                    sm: "0.85rem",
                  }}
                  fontWeight={600}
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "Product"
                    : "Products"}
                </Typography>
              </Box>

              <ProductGrid products={filteredProducts} />
            </>
          )}
      </Container>
    </Box>
  );
};

export default Products;